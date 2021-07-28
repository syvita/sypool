import Web3 from 'web3'
import Binance from 'node-binance-api'
const binance = new Binance().options()
// {
//   APIKEY: '<key>',
//   APISECRET: '<secret>'
// }

import { buildPayload, signPayload } from '../payload.js'
import { ORACLE_SK } from '../config.js'


export async function retrieveBinanceFeed() {
  const ticker = await binance.prices()
  // console.log(ticker)
  const timestamp = Math.floor(Date.now() / 1000)

  const filter = {
    // 'ETHBTC': {
    //   symbol: 'ETH-BTC',
    //   decimals: 100_000_000,
    // },
    // 'LINKBTC': {
    //   symbol: 'LINK-BTC',
    //   decimals: 100_000_000,
    // },
    // 'LINKETH': {
    //   symbol: 'LINK-ETH',
    //   decimals: 1_000_000_000_000_000_000,
    // },
    'STXBTC': {
      symbol: 'STX-BTC',
      decimals: 100_000_000,
    },
    'STXUSDT': {
      symbol: 'STX-USDT',
      decimals: 1_000_000,
    },
    // 'COMPBTC': {
    //   symbol: 'COMP-BTC',
    //   decimals: 100_000_000,
    // },
    // 'LTCBTC': {
    //   symbol: 'LTC-BTC',
    //   decimals: 100_000_000,
    // },
    'UNIBTC': {
      symbol: 'UNI-BTC',
      decimals: 100_000_000,
    },
    // 'AAVEBTC': {
    //   symbol: 'AAVE-BTC',
    //   decimals: 100_000_000,
    // },
    // 'SUSHIBTC': {
    //   symbol: 'SUSHI-BTC',
    //   decimals: 100_000_000,
    // },
  }

  const feed = []
  const src = 'artifix-binance'
  const keys = Object.keys(filter)

  for (let key of keys) {
    // console.log(`${filter[key].symbol} ${parseFloat(ticker[key])} ${parseFloat(ticker[key]) * filter[key].decimals}`)
    const msg = buildPayload(timestamp, filter[key].symbol, Math.floor(parseFloat(ticker[key]) * filter[key].decimals))
    // console.log("msg", msg.toString('hex'))
    const sig = signPayload(msg, ORACLE_SK)
    // console.log("sig_binance", sig.toString('hex'))
    feed.push({src, msg, sig})
  }

  return feed
}

