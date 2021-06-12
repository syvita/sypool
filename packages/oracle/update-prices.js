import {
  processing,
} from './src/tx-utils.js'
import {
  addPrices,
} from './src/clients/oracle-client-tx.js'

import { retrieveCoinbaseOracleFeed } from './src/feeds/coinbase-oracle.js'
import { retrieveOKCoinOracleFeed } from './src/feeds/okcoin-oracle.js'
import { retrieveBinanceFeed } from './src/feeds/binance.js'
import { retrieveOKCoinFeed } from './src/feeds/okcoin.js'

const coinbase_oracle_feed = await retrieveCoinbaseOracleFeed()
const okcoin_oracle_feed = await retrieveOKCoinOracleFeed()
const binance_feed = await retrieveBinanceFeed()
const okcoin_feed = await retrieveOKCoinFeed()

const feed = coinbase_oracle_feed.concat(okcoin_oracle_feed.concat(binance_feed.concat(okcoin_feed)))

console.log("feed", feed.length)
const result = await addPrices(feed)

const processed = await processing(result, 0, 25)
if (!processed) {
  console.log(`failed to execute addPrices after over 12 minutes`)
}

