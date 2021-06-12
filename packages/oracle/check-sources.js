import {
  checkSource,
} from './src/clients/oracle-client-tx.js'

const coinbase = await checkSource('coinbase')
const okcoin = await checkSource('okcoin')
const artifix_okcoin = await checkSource('artifix-okcoin')
const artifix_binance = await checkSource('artifix-binance')
const test1 = await checkSource('test1')
const test2 = await checkSource('test2')

console.log("coinbase", coinbase)
console.log("okcoin", okcoin)
console.log("artifix_okcoin", artifix_okcoin)
console.log("artifix_binance", artifix_binance)
console.log("test1", test1)
console.log("test2", test2)

