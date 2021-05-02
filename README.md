**UPDATE: the grant request for mining hardware to the Stacks Foundation has been approved [here](https://github.com/stacksgov/Stacks-Grants/issues/83) ($2500)**

![repo header gradient](readme-img/repo-header.png "repo header gradient")
# Sypool

![repo header gradient](readme-img/repo-header.png "repo header gradient")

## How it works (simple)

Mining STX tokens is a game of numbers. in order to mine profitably, an estimated ~1BTC is required initially. Many people don't have 1BTC to throw at a new miner, so i made this!

This 'pool' combines lots of people's bitcoin together to mine STX profitably. You put Bitcoin in and get STX tokens out. You commit bitcoin at our site, which will then add you to the list of contributors in the smart contract.

There is a 5% fee, so we can pay for servers and hosting etc. we pay for all the transaction fees out of this too.

### The Sypool ($SYPL) token

When you commit your sats, we'll send an equal amount of Sypool tokens to your stacks address. If you contribute 500,000 sats, you get 500,000 Sypool tokens to your stacks address.

What can you do with these tokens? You can vote on decisions that we as a community might make in the future, and more importantly, you can redeem your STX rewards.

After 1000 blocks (1 cycle), you'll be able to redeem your STX rewards. You will probably not make a profit after this 1000 block cooldown, as all of your Bitcoin would not have been used for mining yet. Don't worry if you don't make a profit, as the miner will eventually use up all your BTC.

### dem fees seem a lil' high

Many people will think the 5% cut is a lot and I understand that. I have the intention to make this mining pool free in the future. I don't currently have a source of income, so this will help me personally significantly. after some time, I'll lower the fees, potentially removing the fees all together when I can.

What's that you say? That's not very business like? Oh well. we're just nice :)

Once the pool gains 100K USD worth of bitcoin, Sypool will be able to redeem a bounty of 100K STX tokens from [Daemon Technologies](https://daemontechnologies.co/) (we love you Xan). This will help to support Syvita significantly. 

My current (maybe outdated) roadmap is available [here on my profile](https://github.com/pxydn). This constantly changes and we're adding new projects and members to Syvita rapidly. Lots of the fees from this pool will go towards funding Syvita and its endeavours. you can see what projects we work on [here](https://github.com/syvita). 

### bro i got trust issues

Understandably. We're as transparent as possible, and automate as much as we can so there's less grey area for us to go wrong. 

Once you commit Bitcoin, after the cooldown, you can take your share out (if you want), even if all our services go down. This is ensured by the smart contract and requires no manual intervention from us. 

The only trust is that we use the Bitcoin to mine. Basically everything else is automated and trustless through the contract. And if we don't use the Bitcoin to mine, 20% of the 5% fee goes towards collateral providers, to reduce risk.

![repo header gradient](readme-img/repo-header.png "repo header gradient")

## ok but how does it *really* work

**warning: nerdy bits ahead**

Syvita's pool is not unique in that it is primarily controlled by a smart contract. However, it is unique in how it verifies contributions cross-chain through hashing, merkle roots and some other cool stuff. Big s/o to [Jude](https://github.com/jcnelson) at the Stacks Foundation for how this works. He wrote the majority of the Bitcoin library functions that the pool uses to verify contributions.

### From start to finish

First, a user that wants to contribute bitcoin hashes a `secret` with `SHA512`. This is generated in the UI client-side for ease-of-use. This hash is then added to the `HashMap`  in the smart contract through the public function `register-hash`. Once they've done this, the hash is stored along with the `tx-sender`, in this case, the Stacks address the user wants their rewards to be redeemable to.

Once the smart contract call confirmed and is ok, the user sends a Bitcoin transaction to add their Bitcoin to the pool's publicly known BTC address with `secret` in the `OP_RETURN` output of the transaction. This can be from any Bitcoin address or key, and doesn't have to be one tied to the Stacks redeem address.

Once *that* confirms on the BTC chain, the user calls the `reveal-hash` function with the transaction, a Merkle proof and `secret`. this function verifies that:
1. the transaction was mined on the Bitcoin chain (using the Merkle proof)
2. `secret` is registered in `hash-map` that was stored in the first step
3. the transaction pays out to the known pool BTC address that's used to mine.

If all of those return ok, the contract extracts how many sats were added to the pool and mints that amount of P3 fungible tokens to the `tx-sender` in `hash-map`.

Worth noting that these fields will be autofilled by the UI to improve ease-of-use, though can be set manually (if something goes wrong with the UI). The user will enter their txid once it has been mined, then the UI will pull the necessary info from a Bitcoin node. Also worth saying - all these values can be entered manually by you in the UI (or the [Stacks Explorer](https://explorer.stacks.co) even) if you don't trust what the UI is doing. UI is also open-source and in this repo for you to read through if you want :)

Cool. All done. And now for the (relatively) simpler mining process. The Bitcoin that's sent to the pool are then transferred to Stackers to try to win the ability to mine the block. If the miner wins this 'lottery' against other miners, the miner gets the block reward and all transaction fees in that.

The miner also will mine microblocks when it has won a block, which you can read more about [here](https://docs.blockstack.org/understand-stacks/mining#transaction-fees), along with other cool stuff for mining.

When the miner gets the rewards, it creates a transaction in that block that immediately sends the STX rewards to the smart contract. Over time, these will average out and make it so (hopefully) each user of the mining pool makes a healthy profit.

The 5% fee only applies on profit. The contract will get the current STX/BTC price and calculate how much profit you made, then charge the 5% fee on the profit you made. If you made a loss, the fee doesn't apply

### Architecture

There are 5 parts to the mining pool infrastructure wise.

1. the smart contract (on the Stacks blockchain).
2. the website/UI
3. the Bitcoin node, used to spend bitcoin with
4. Stacks node A, running in miner mode and connected to the local bitcoin node
5. Stacks node B, running in follower mode as a publicly available API.

The web UI will be hosted as a static Next.js site on Cloudflare's edge, alike other L3 sites. The static site will make API requests to Stacks node B as default. The code for this site is in this repo.

The Bitcoin node & Stacks node A (the miner) will be hosted on a Mac Mini owned and managed by [@pxydn](https://github.com/pxydn). This will be locally controlled and not accessable to the public internet as the private keys to the pool Bitcoin wallet are held here. The Mac is connected only via a VPN, as to not expose the IP address, open any public ports to the machine and reduce the attack surface. The Bitcoin node is [Bitcoin Core](https://bitcoincore.org/) and the Stacks node is the [one created by Hiro](https://github.com/blockstack/stacks-blockchain).

Stacks node B will be run as a VM on [Bitlaunch](https://bitlaunch.io/). No private keys or funds are stored on this machine. It will be connected to requests to it via a [Cloudflare Argo Tunnel](https://www.cloudflare.com/en-gb/products/argo-tunnel/), to protect from attacks. This node runs [stacks-blockchain-api](https://github.com/blockstack/stacks-blockchain-api), created by [Hiro](https://hiro.so).

Both Stacks nodes will be updated as new releases of the Stacks node software are released. Stacks node B will have a 2nd VM booted and connected to Cloudflare until it has caught up with the chain, then traffic will be routed to it via Cloudflare and the other VM will be destroyed. Stacks node A will use a similar method, but will start a new instance on the same machine instead.
