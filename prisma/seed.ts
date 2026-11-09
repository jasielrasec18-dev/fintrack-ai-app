import { resetDemo } from '../src/lib/demo'

resetDemo()
    .then(({ transactions }) => {
        console.log(`Conta de demonstração pronta: ${transactions} transações.`)
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
