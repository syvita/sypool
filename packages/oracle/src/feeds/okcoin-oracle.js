import fetch from 'node-fetch'
import { convertSig } from '../payload.js'

const okcoin_endpoint = 'https://www.okcoin.com/api/market/v3/oracle'

export async function retrieveOKCoinOracleFeed() {
  const result = await fetch(okcoin_endpoint)
  const json = await result.json()
  const feed = []
  for (let i = 0; i < json.messages.length; i++) {
    feed.push({
      src: 'okcoin',
      msg: Buffer.from(json.messages[i].slice(2), 'hex'),
      sig: convertSig(json.signatures[i]),
    })
  }
  return feed
}
