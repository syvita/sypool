**UPDATE: the grant request for hardware to the Stacks Foundation has been submitted [here](https://github.com/stacksgov/Stacks-Grants/issues/83) ($2500)**

![repo header gradient](readme-img/repo-header.png "repo header gradient")
# labs³ pool

![repo header gradient](readme-img/repo-header.png "repo header gradient")

## how it works (simple)

mining STX tokens is a game of numbers. in order to mine profitably, an estimated ~1BTC is required initially. many people don't have 1BTC to throw at a new miner, so i made this!

this 'pool' combines lots of people's bitcoin together to mine STX profitably. you put bitcoin in and get stx tokens out. you commit bitcoin at our site, which will then add you to the list of contributors in the smart contract.

there is a 5% fee, so we can pay for servers and hosting etc. we pay for all the transaction fees out of this too.

### the Pool³ token

when you commit your sats, we'll send an equal amount of Pool³ tokens to your stacks address. if you contribute 500,000 sats, you get 500,000 Pool³ tokens to your stacks address.

what can you do with these tokens? you can vote on decisions that we as a community might make in the future, and more importantly, you can redeem your STX rewards.

after 1000 blocks (1 cycle), you'll be able to redeem your STX rewards. you will probably not make a profit after this 1000 block cooldown, as all of your bitcoin would not have been used for mining yet. don't worry if you don't make a profit, as the miner will eventually use up all your BTC.

### dem fees seem a lil' high

many people will think the 5% cut is a lot and i understand that. i have the intention to make this mining pool free in the future. i don't currently have a source of income, so this will help me personally significantly. after some time, i'll lower the fees, potentially removing the fees all together when i can.

what's that you say? that's not very business like? oh well. we're just nice :)

once the pool gains 100K USD worth of bitcoin, the pool will be able to redeem a bounty of 100K STX tokens from [Daemon Technologies](https://daemontechnologies.co/) (we love you Xan). this will help along L3 significantly. 

my current (maybe outdated) roadmap is available [here on my profile](https://github.com/pxydn). this constantly changes and we're adding new projects and members to L3 rapidly. lots of the fees from this pool will go towards funding L3 and its endeavours. you can see what projects we work on [here](https://github.com/labs3). 

### bro i got trust issues

understandably. we're as transparent as possible, and automate as much as we can so there's less grey area for us to go wrong. 

once you commit bitcoin, after the cooldown, you can take your share out (if you want), even if all our servers go down. this is ensured by the smart contract and requires no manual intervention from us. 

the only trust is that we use the bitcoin to mine. basically everything else is automated and trustless through the contract

![repo header gradient](readme-img/repo-header.png "repo header gradient")

## ok but how does it *really* work

**warning: nerdy bits ahead**

L3's pool is not unique in that it is primarily controlled by a smart contract. however, it is unique in how it verifies contributions cross-chain through hashing, merkle roots and some other cool stuff. big s/o to [Jude](https://github.com/jcnelson) at the Stacks Foundation for how this works. he wrote the majority of the functions that the pool uses to verify contributions.

### from start to finish

first, a user that wants to contribute bitcoin hashes a `secret` with `SHA512`. this is generated in the UI client-side for ease-of-use. this hash is then added to the `hash-map`  in the smart contract through the public function `register-hash`. once they've done this, the hash is stored along with the `tx-sender`, in this case, the Stacks address the user wants their rewards to be redeemable to.

once the smart contract call confirmed and is ok, the user sends a bitcoin transaction to add their bitcoin to the pool's publicly known BTC address with `secret` in the `OP_RETURN` output of the transaction. this can be from any bitcoin address or key, and doesn't have to be one tied to the Stacks address.

once *that* confirms on the BTC chain, the user calls the `reveal-hash` function with the transaction, a Merkle proof and `secret`. this function verifies that:
1. the transaction was mined on the Bitcoin chain (using the Merkle proof)
2. `secret` is registered in `hash-map` that was stored in the first step
3. the transaction pays out to the known pool BTC address that's used to mine.

if all of those return ok, the contract extracts how many sats were added to the pool and mints that amount of P3 fungible tokens to the `tx-sender` in `hash-map`.

worth noting that these fields will be autofilled by the UI to improve ease-of-use, though can be set manually (if something goes wrong with the UI). the user will enter their txid once it has been mined, then the UI will pull the necessary info from an L3 bitcoin node. also worth saying - all these values can be entered manually by you in the UI (or the [Stacks Explorer](https://explorer.stacks.co) even) if you don't trust what the UI is doing. UI is also open-source and in this repo for you to read through if you want :)

cool. all done. and now for the (relatively) simpler mining process. the bitcoins that are sent to the pool are then transferred to Stackers to try to win the ability to mine the block. if the miner wins this lottery against other miners, the miner gets the block reward and all transaction fees in that.

the miner also will mine microblocks when it has won a block, which you can read more about [here](https://docs.blockstack.org/understand-stacks/mining#transaction-fees), along with other cool stuff for mining.

when the miner gets the rewards, it creates a transaction in that block that immediately sends the STX rewards to the smart contract. over time, these will average out and make it so each user of the mining pool makes a healthy profit.

also i needa work out how the 5% fee will be taken, that's still a WIP :)

### architecture

there are 5 parts to the mining pool infrastructure wise.

1. the smart contract (on the Stacks blockchain).
2. the website/UI
3. the Bitcoin node, used to spend bitcoin with
4. Stacks node A, running in miner mode and connected to the local bitcoin node
5. Stacks node B, running in follower mode as a publicly available API.

the web UI will be hosted as a static nextjs site on Cloudflare's edge, alike other L3 sites. the static site will make API requests to Stacks node B as default. the code for this site is in this repo.

the Bitcoin node & Stacks node A (the miner) will be hosted on a Mac Mini owned and managed by [@pxydn](https://github.com/pxydn). this will be locally controlled and not accessable to the public internet as the private keys to the pool Bitcoin wallet are held here. the Mac is connected only via Mullvad VPN, as to not expose the IP address, open any public ports to the machine and reduce the attack surface. the bitcoin node is [Bitcoin Core](https://bitcoincore.org/) and the Stacks node is the [one created by Hiro](https://github.com/blockstack/stacks-blockchain)

Stacks node B will be run as a VM on [Bitlaunch](https://bitlaunch.io/). no private keys or funds are stored on this machine. it will be connected to requests to it via a [Cloudflare Argo Tunnel](https://www.cloudflare.com/en-gb/products/argo-tunnel/), to protect from attacks. this node runs [stacks-blockchain-api](https://github.com/blockstack/stacks-blockchain-api), created by [Hiro](https://hiro.so).

both Stacks nodes will be updated as new releases of the Stacks node software are released. Stacks node B will have a 2nd VM booted and connected to Cloudflare until it has caught up with the chain, then traffic will be routed to it via Cloudflare and the other VM will be destroyed. Stacks node A will use a similar method, but will start a new instance on the same machine instead.
