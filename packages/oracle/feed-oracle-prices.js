import { readFileSync, writeFileSync } from 'fs'
import {
  getNonce,
  timeout,
} from './src/tx-utils.js'
import {
  addPrices,
} from './src/clients/oracle-client-tx.js'

import { retrieveCoinbaseOracleFeed } from './src/feeds/coinbase-oracle.js'
import { retrieveOKCoinOracleFeed } from './src/feeds/okcoin-oracle.js'
import { retrieveBinanceFeed } from './src/feeds/binance.js'
import { retrieveOKCoinFeed } from './src/feeds/okcoin.js'

const filename = './nonce.json'
const past_data_json = readFileSync(filename)
const past_data = JSON.parse(past_data_json)

let nonce = await getNonce()
console.log("nonce", nonce, "past_data.nonce", past_data.nonce)

while (nonce < past_data.nonce) {
  await timeout(1000 * 60)  // 1 minute
  nonce = await getNonce()
}

while (true) {
  const coinbase_oracle_feed = await retrieveCoinbaseOracleFeed()
  const okcoin_oracle_feed = await retrieveOKCoinOracleFeed()
  const binance_feed = await retrieveBinanceFeed()
  const okcoin_feed = await retrieveOKCoinFeed()

  const feed = coinbase_oracle_feed.concat(okcoin_oracle_feed.concat(binance_feed.concat(okcoin_feed)))

  console.log("feed", feed.length)
  const result = await addPrices(feed, {nonce})

  writeFileSync(filename, JSON.stringify({
    nonce: nonce + 1,
  }, null, 2))

  let next_nonce = await getNonce()

  // TODO(psq): check for > instead, caching can be bad with this LB
  while (next_nonce <= nonce) {
    console.log("next_nonce", next_nonce, "nonce", nonce)
    await timeout(1000 * 60)  // 1 minute
    next_nonce = await getNonce()
  }
  nonce = next_nonce
  console.log("new nonce", nonce)
}

