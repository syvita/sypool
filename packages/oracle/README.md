# stacks-open-oracle

## Introduction
While waiting for a more distributed solution (Where are you Chainlink?), this provides authenticated feeds (i.e. only the entity with the private key that matches the public key can generate that feed, but you have to trust that entity).  If enough other people also upload their feeds, then we can add a layer on top this to aggregate prices, and minimize some feeds misbehaving.

When calling addPrices, the contract will verify that the signature matches the public key for that source, so prices can be retrieved very quickly.  Anyone can call addPrices, but the source and public key should verify, and the timestamp needs to be later than the existing value


When a pair has one symbol, the price is against USD, otherwise, againt the second symbol (for example, Binance does not have USD pairs, only USDT or other stable coins).  So for example `STX` is the STX price in USD, while `STX-BTC` is the price of STX in BTC (adjusted for the relevant number of decimals, 6 by default, 8 for BTC, and lots for ETH (ok, 18)).


## Feeds

### Coinbase open oracle feed
doc at: https://docs.pro.coinbase.com/#oracle, api key required, sadly

Source: "coinbase"

Symbols: BTC, ETH, LINK, COMP, UNI, SNX

Eth address: `0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC`

Compressed public key usable in Clarity: `0x034170a2083dccbc2be253885a8d0e9f7ce859eb370d0c5cae3b6994af4cb9d666`

### OKCoin open oracle feed
A feed provided at https://www.okcoin.com/api/market/v3/oracle

Source: "okcoin"

Symbols: BTC, ETH

Eth address: `0x419c555b739212684432050b7ce459ea8e7b8bda`

Compressed public key usable in Clarity: `0x0325df290b8c4930adcf8cd5c883616a1204ccc3d6ba3c4a636d6bcecd08e466d3`

### ArtifiX OKCoin feed
A feed pulled from OKCoin, and signed by one of my keys

Source: "artifix-okcoin"

Symbols: BTC, ETH, LINK, STX-BTC, STX, COMP, LTC, UNI

Public key: `0x02752f4db204f7cdf6e022dc486af2572579bc9a0fe7c769b58d95f42234269367`

### ArtifiX Binance feed
A feed pulled from Binance, and signed by one of my keys

Source: "artifix-binance"

Symbols: ETH-BTC, LINK-BTC, LINK-ETH, STX-BTC, STX-USDT, COMP-BTC, LTC-BTC, UNI-BTC, AAVE-BTC, SUSHI-BTC

Public key: `0x02752f4db204f7cdf6e022dc486af2572579bc9a0fe7c769b58d95f42234269367`

## Retrieving prices
Call `get-price` with `source` and `symbol`, for example:
```
(get-price "coinbase" "BTC")

(contract-call? 'SPZ0RAC1EFTH949T4W2SYY6YBHJRMAF4ECT5A7DD.oracle-v1 get-price "coinbase" "BTC")

```
to get the latest price for BTC (in USD) from the Coinbase feed

Add your own feed (ping @psq on discord and I can add your source public key, or create an issue on this repo), or you can fork this repo and deploy your own contract (make sure you change the owner key)

## Deployment
The first version of the contract is deployed on mainnet at `SPZ0RAC1EFTH949T4W2SYY6YBHJRMAF4ECT5A7DD.oracle-v1`

Deploying this early so I can figure out what it takes to reliably upload prices, hopefully every blocks, and hopefully the transactions won't be too big for miners to process...

## Future
Don't let the inital set of values limit your thinking, a symbol/value pair does not have a be a crypto currency, it could be a stock, a temperature, a forecast, or anything that could be reduced to a 128 bits number (yes, you could even twist it to store a 16 charaters string, or even a buffer, no processing is done as long as it can be represented as a uint)

I would hope more people will participate and upload their own feeds, and we can then build a second layer on top of this basic oracle to get something more distributed and more resilient like Chainlink.  I would think we can trust the open oracle feeds from Coinbase and OKCoin, and hopefully you'll trust mine.

Will probably add a CoinGecko feed next with STX, STX-BTC, CoinMarketCap does not seem worth the expense (unless scraping...)

The current implementation does not play very well with how Clarity calculates some of the buffer function runtime costs, so the 14 values currently being uploaded do take up over 50% of the block runtime budget, which is is quite unfortunate and would prevent scaling the current implementation.  Hopefully, the contract can be refactored to not burn through that much of the runtime budget.  Stay tuned...

Suggestions welcome!

If you'd like to contribute, open a PR, and small STX donations are welcome to `SPZ0RAC1EFTH949T4W2SYY6YBHJRMAF4ECT5A7DD` to help pay for keeping the feed alive (unless I figure out a way to use microblocks), at the current block frequency, it will cost less than 1 STX per day, at least I think, for 14 data points, 26 overflows the block, which is an other topic for an other day)

## Credits
Extra credits to @jcnelson for sharing an approach to manipulate buffers (https://gist.github.com/jcnelson/76c44b4209c29a19d2dbc06a0e7b446e)
