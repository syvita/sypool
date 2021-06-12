import {
  getPrice,
} from './src/clients/oracle-client-tx.js'

async function checkPrice(source, symbol) {
  const value = await getPrice(source, symbol)
  if (value) {
    console.log(source, symbol, value.amount, value.height, value.timestamp, new Date(value.timestamp * 1000))
  } else {
    console.log(source, symbol, "no result")
  }
}

await checkPrice('artifix-okcoin', 'TEST')

await checkPrice('coinbase', 'BTC')
await checkPrice('coinbase', 'ETH')
// await checkPrice('coinbase', 'LINK')
// await checkPrice('coinbase', 'COMP')
await checkPrice('coinbase', 'UNI')
await checkPrice('coinbase', 'SNX')

await checkPrice('okcoin', 'BTC')
await checkPrice('okcoin', 'ETH')

await checkPrice('artifix-okcoin', 'BTC')
await checkPrice('artifix-okcoin', 'ETH')
// await checkPrice('artifix-okcoin', 'LINK')
await checkPrice('artifix-okcoin', 'STX-BTC')
await checkPrice('artifix-okcoin', 'STX')
// await checkPrice('artifix-okcoin', 'COMP')
// await checkPrice('artifix-okcoin', 'LTC')
await checkPrice('artifix-okcoin', 'UNI')

// await checkPrice('artifix-binance', 'ETH-BTC')
// await checkPrice('artifix-binance', 'LINK-BTC')
// await checkPrice('artifix-binance', 'LINK-ETH')
await checkPrice('artifix-binance', 'STX-BTC')
await checkPrice('artifix-binance', 'STX-USDT')
// await checkPrice('artifix-binance', 'COMP-BTC')
// await checkPrice('artifix-binance', 'LTC-BTC')
await checkPrice('artifix-binance', 'UNI-BTC')
// await checkPrice('artifix-binance', 'AAVE-BTC')
// await checkPrice('artifix-binance', 'SUSHI-BTC')
