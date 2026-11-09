import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
    },
    test: {
        include: ['src/**/__tests__/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary'],
            include: [
                'src/lib/finance.ts',
                'src/lib/format.ts',
                'src/app/_constants/category-keywords.ts',
            ],
        },
    },
})
