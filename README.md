# metapool

*the first STX mining pool!*

## how it works

mining STX tokens is a game of numbers. in order to mine profitably, an estimated ~1BTC is required initially. many people don't have 1BTC to throw at a new miner, so i made this!

this 'pool' combines lots of people's bitcoin together to mine STX profitably. you put bitcoin in and get stx tokens out. you commit bitcoin at our site, which will then add you to the list of contributors in the smart contract.

there is a 10% fee, so we can pay for servers and hosting etc. we pay for all the transaction fees out of this too.

### metapool token

when you commit your sats, we'll send an equal amount of metapool tokens to your stacks address. if you contribute 500,000 sats, you get 500,000 metapool tokens to your stacks address.

what can you do with these tokens? you can vote on decisions that we as a community might make in the future, and more importantly, you can redeem your STX rewards. this makes metapool a DAO, or Decentralised Autonomous Organisation.

after 1000 blocks (1 cycle), you'll be able to redeem your STX rewards.

### dem fees seem a lil high

10% is sorta high for a pool. i know many people will think this is a lot and i understand that. i have the intention to make this mining pool free in the future. i don't currently have a source of income, so the fees from this will go towards my pile of stx, which i can stack to effectively live off the bitcoin rewards. after i gain enough from this pool, i'll lower the fees, potentially removing the fees all together when i can.

once the pool gains 100K USD worth of bitcoin, Daemon Technologies will kindly give us a bounty of 100K STX tokens. this will help along significantly. once i have enough and can live off stacking, i'll be able to devote all my time to Stacks. i'll be able to build free services for everyone, which i think will give you more value than the 10% cut i take from this.

my current roadmap is available [here on my profile](https://github.com/pxydn). this is what i plan to be doing after the pool, and the projects i plan on developing for free for all.

## technically...

all of the code for the pool is open-source so you can see we're not doing anything shady. most of the heavy lifting is done by the smart contract, on-chain. 

### bro i got trust issues

understandably. we're as transparent as possible, and automate as much as we can so there's less grey area for us to go wrong. 

we hold the keys to the control address, which means you have to trust us that we won't go and spend all your stx rewards or the bitcoin you committed. however, once you commit bitcoin, after the cooldown, you can take your share out (if you want). this is ensured by the smart contract and requires no manual intervention from us.
