import { expect, type Page, test } from '@playwright/test'

async function pick(page: Page, id: string, option: string) {
    await page.locator(`#${id}`).click()
    await page.getByRole('option', { name: option, exact: true }).click()
}

// O login recarrega a página, e um clique nesse intervalo se perde.
async function openNewTransaction(page: Page) {
    await expect(async () => {
        await page
            .getByRole('button', { name: 'Adicionar', exact: true })
            .click()
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 1_000 })
    }).toPass()
}

async function createTransaction(page: Page, name: string) {
    await openNewTransaction(page)
    await page.locator('#name').fill(name)
    await page.locator('#amount').fill('1234')
    await expect(page.locator('#amount')).toHaveValue(/12,34/)
    await pick(page, 'type', 'Despesa')
    await pick(page, 'category', 'Outros')
    await pick(page, 'paymentMethod', 'Pix')
    await page.locator('#date').fill(new Date().toISOString().slice(0, 10))
    await page.getByRole('button', { name: 'Salvar transação' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
}

test.beforeEach(async ({ page }) => {
    // Nenhum teste chama a IA de verdade.
    await page.route('**/api/ai-insights', (route) =>
        route.fulfill({
            json: {
                suggestion: 'Reduza os gastos com moradia neste mês.',
                topCategory: 'Moradia',
                topCategoryAmount: 'R$ 2.330,00',
            },
        })
    )
    await page.route('**/api/ai-categorize', (route) =>
        route.fulfill({ json: { category: 'FOOD', type: null } })
    )

    // O Better Auth limita os logins por IP, então uma tentativa pode ser recusada.
    await expect(async () => {
        await page.goto('/')
        if (page.url().includes('/sign-in')) {
            await page.waitForLoadState('networkidle')
            await page
                .getByRole('button', { name: 'Entrar como visitante' })
                .click()
        }
        await expect(page.getByText('Saldo total')).toBeVisible({
            timeout: 10_000,
        })
    }).toPass({ intervals: [4_000], timeout: 45_000 })
})

test('login como visitante mostra o dashboard e o modo demonstração', async ({
    page,
}) => {
    await expect(page.getByText('modo demonstração')).toBeVisible()
    await expect(page.getByText('Evolução mensal')).toBeVisible()
    await expect(page.getByText('Reduza os gastos com moradia')).toBeVisible()
})

test('sugere categoria e respeita a escolha manual', async ({ page }) => {
    await openNewTransaction(page)
    await page.locator('#name').fill('Compra qualquer')

    await expect(page.getByText('Sugerido pela IA')).toBeVisible()
    await expect(page.locator('#category')).toContainText('Alimentação')

    await pick(page, 'category', 'Saúde')
    await expect(page.getByText('Sugerido pela IA')).toBeHidden()
    await expect(page.locator('#category')).toContainText('Saúde')
})

test('cria uma transação pelo modal', async ({ page }) => {
    const name = `Teste criar ${Date.now()}`

    await createTransaction(page, name)

    await expect(page.getByText('Transação adicionada')).toBeVisible()
    await page.getByRole('link', { name: 'Transações' }).first().click()
    await expect(page.getByRole('cell', { name, exact: true })).toBeVisible()
})

test('busca e exclui uma transação', async ({ page }) => {
    const name = `Teste excluir ${Date.now()}`
    await createTransaction(page, name)

    await page.goto('/transactions')
    await page.getByLabel('Buscar transação pelo nome').fill(name)
    await expect(page).toHaveURL(/q=Teste/)
    await expect(page.getByText('Mostrando 1–1 de 1')).toBeVisible()

    await page
        .getByRole('button', { name: `Excluir transação ${name}` })
        .click()
    await page.getByRole('button', { name: 'Excluir', exact: true }).click()

    await expect(page.getByText('Transação excluída')).toBeVisible()
    await expect(page.getByRole('cell', { name, exact: true })).toBeHidden()
})

test('salva um orçamento', async ({ page }) => {
    await page.getByRole('link', { name: 'Orçamentos' }).first().click()
    await page.getByLabel('Saúde').fill('300')
    await page.getByRole('button', { name: 'Salvar orçamentos' }).click()

    await expect(page.getByText('Orçamentos salvos')).toBeVisible()
    await page.goto('/')
    await expect(page.getByText(/de R\$\s*300,00/)).toBeVisible()
})
