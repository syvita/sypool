import { Client } from 'coinbase'
import crypto from 'crypto'
import fetch from 'node-fetch'

import { convertSig } from '../payload.js'

import {
  COINBASE_KEY,
  COINBASE_SECRET,
  COINBASE_PASSPHRASE,
} from '../config.js'

const filter = [
  'BTC',
  'ETH',
  // 'LINK',
  // 'COMP',
  'UNI',
  'SNX',
]

const client = new Client({
  'apiKey': COINBASE_KEY,
  'apiSecret': COINBASE_SECRET,
})

// coinbase public key: fCEAdAFab14d46e20144F48824d0C09B1a03F2BC
const coinbase_endpoint = 'https://api.pro.coinbase.com/oracle'

// OKCoin public key: 419c555b739212684432050b7ce459ea8e7b8bda
const okcoin_endpoint = 'https://www.okcoin.com/api/market/v3/oracle'


const generateSignature = function(path, method, bodyStr) {
  const timestamp = Math.floor(Date.now() / 1000)
  const message = timestamp + method + '/v2/' + path + bodyStr
  const signature = crypto.createHmac('sha256', COINBASE_SECRET).update(message).digest('hex')

  return {
    'digest': signature,
    'timestamp': timestamp
  }
}

const signRequest = (method, path, body/*, options = {}*/) => {
  const timestamp = Date.now() / 1000
  const what = timestamp + method.toUpperCase() + path + body
  const key = Buffer.from(COINBASE_SECRET, 'base64')
  const hmac = crypto.createHmac('sha256', key)
  const signature = hmac.update(what).digest('base64')
  return {
    key: COINBASE_KEY,
    signature: signature,
    timestamp: timestamp,
    passphrase: COINBASE_PASSPHRASE,
  }
}

export async function retrieveCoinbaseOracleFeed() {
  const path = '/oracle'
  const method = 'GET'
  const body = ''
  const version = undefined
  const sig = signRequest(method, path, body)

  // add signature and nonce to the header
  const headers = {
    'CB-ACCESS-SIGN': sig.signature,
    'CB-ACCESS-TIMESTAMP': sig.timestamp,
    'CB-ACCESS-KEY': COINBASE_KEY,
    'CB-VERSION': version || '2016-02-18',
    'CB-ACCESS-PASSPHRASE': COINBASE_PASSPHRASE,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'coinbase-pro-node-client',
  }

  try {
    const json = await (await fetch(
      coinbase_endpoint,
      {
        method: 'get',
        headers,
      }
    )).text()
    const data = JSON.parse(json)
    const keys = Object.keys(data.prices)
    const feed = []
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (filter.indexOf(key) !== -1) {
        feed.push({
          src: 'coinbase',
          msg: Buffer.from(data.messages[i].slice(2), 'hex'),
          sig: convertSig(data.signatures[i]),
        })
      }
    }
    return feed
  } catch(e) {
    console.log("retrieveCoinbaseOracleFeed error", e)
    throw e
  }
}
