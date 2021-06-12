TODO
- instead of sending large buffer, try the other way around, send separate values (much smaller, and build message buffer for signing verification in clarity, all these `(buff 256)` are insanely expensive, when there is no reason they should be so)
- use RBF to get data closer to actual block?
- what about microblocks, there is not really any docs available on how to use with sdks...
- coingecko: `curl -X GET "https://api.coingecko.com/api/v3/coins/blockstack" -H "accept: application/json"`

DONE
+ finish deploy-contracts and test
+ finish update-prices and test
+ deploy on mocknet
+ deploy on mainnet on throwaway address
+ deploy on mainnet on official address
x setup a cron job, every 5 minutes or so, but only broadcast if nonce has changed
+ check nonce, store for safe restart, and only send new transaction on new nonce (except will most often miss every other block)
+ deploy wiht pm2
