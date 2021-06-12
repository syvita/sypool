import fetch from 'node-fetch'

import { buildPayload, signPayload } from '../payload.js'
import { ORACLE_SK } from '../config.js'

const sample = [
  {
    "best_ask": "48907.15",
    "best_bid": "48881.95",
    "instrument_id": "BTC-USD",
    "open_utc0": "47937.57",
    "open_utc8": "48063.27",
    "product_id": "BTC-USD",
    "last": "48855.41",
    "last_qty": "0",
    "ask": "48907.15",
    "best_ask_size": "0.041",
    "bid": "48881.95",
    "best_bid_size": "0.0381",
    "open_24h": "47712.41",
    "high_24h": "49962.66",
    "low_24h": "47078.92",
    "base_volume_24h": "938.7582",
    "timestamp": "2021-02-16T11:17:03.028Z",
    "quote_volume_24h": "45458835.4175"
  },
  {
    "best_ask": "0.00001498",
    "best_bid": "0.00001451",
    "instrument_id": "STX-BTC",
    "open_utc0": "0.00001439",
    "open_utc8": "0.00001428",
    "product_id": "STX-BTC",
    "last": "0.00001474",
    "last_qty": "0",
    "ask": "0.00001498",
    "best_ask_size": "2137.72316156",
    "bid": "0.00001451",
    "best_bid_size": "2107.433",
    "open_24h": "0.00001393",
    "high_24h": "0.00001891",
    "low_24h": "0.00001393",
    "base_volume_24h": "337956.94570675",
    "timestamp": "2021-02-16T11:17:03.022Z",
    "quote_volume_24h": "5.07026472"
  },
  {
    "best_ask": "0.714",
    "best_bid": "0.7095",
    "instrument_id": "STX-USD",
    "open_utc0": "0.6895",
    "open_utc8": "0.6786",
    "product_id": "STX-USD",
    "last": "0.7124",
    "last_qty": "0",
    "ask": "0.714",
    "best_ask_size": "2904.35",
    "bid": "0.7095",
    "best_bid_size": "2111.885",
    "open_24h": "0.6649",
    "high_24h": "0.7999",
    "low_24h": "0.6649",
    "base_volume_24h": "607650.449038",
    "timestamp": "2021-02-16T11:17:03.151Z",
    "quote_volume_24h": "435359.029238"
  },
]

async function fetchInstruments() {
  const url = 'https://www.okcoin.com/api/spot/v3/instruments/ticker'
  const json = await (await fetch(url)).text()
  return JSON.parse(json)
}

function getPair(ticker, data) {
  return data.find(pair => pair.instrument_id === ticker)
}

function midPrice(pair) {
  return (parseFloat(pair.best_ask) + parseFloat(pair.best_bid)) / 2
}



export async function retrieveOKCoinFeed() {
  const timestamp = Math.floor(Date.now() / 1000)
  const instruments = await fetchInstruments()

  // const stx_usd = getPair('STX-USD', instruments)
  // const stx_btc = getPair('STX-BTC', instruments)
  // const btc_usd = getPair('BTC-USD', instruments)
  // console.log(`okcoin:  stx-usd ${midPrice(stx_usd)}`)
  // console.log(`okcoin:  stx-btc ${midPrice(stx_btc)}`)
  // console.log(`okcoin:  btc-usd ${midPrice(btc_usd)}`)

  const filter = {
    'BTC-USD': {
      symbol: 'BTC',
      decimals: 1_000_000,
    },
    'ETH-USD': {
      symbol: 'ETH',
      decimals: 1_000_000,
    },
    // 'LINK-USD': {
    //   symbol: 'LINK',
    //   decimals: 1_000_000,
    // },
    'STX-BTC': {
      symbol: 'STX-BTC',
      decimals: 100_000_000,
    },
    'STX-USD': {
      symbol: 'STX',
      decimals: 1_000_000,
    },
    // // 'COMP-USD': {
    // //   symbol: 'COMP',
    // //   decimals: 1_000_000,
    // // },
    // 'LTC-USD': {
    //   symbol: 'LTC',
    //   decimals: 1_000_000,
    // },
    'UNI-USD': {
      symbol: 'UNI',
      decimals: 1_000_000,
    },
  }

  const feed = []
  const src = 'artifix-okcoin'
  const keys = Object.keys(filter)

  for (let key of keys) {
    const pair = getPair(key, instruments)
    if (!pair) {
      console.log("key not found", key)
    }

    // console.log(`====> ${filter[key].symbol} ${midPrice(pair)} ${midPrice(pair) * filter[key].decimals}`)
    const msg = buildPayload(timestamp, filter[key].symbol, Math.floor(midPrice(pair) * filter[key].decimals))
    // console.log("msg", msg.toString('hex'))
    const sig = signPayload(msg, ORACLE_SK)
    // console.log("sig_okcoin", sig.toString('hex'))
    feed.push({src, msg, sig})
  }

  return feed
}

