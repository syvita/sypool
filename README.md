[![CodeFactor](https://www.codefactor.io/repository/github/syvita/sypool/badge)](https://www.codefactor.io/repository/github/syvita/sypool) 
---

<img src="https://x.syvita.org/repoheaders/sypool.png"></img>

**UPDATE:** The grant request for mining hardware to the Stacks Foundation has [been approved.](https://github.com/stacksgov/Stacks-Grants/issues/83)

---

<a href="https://gitpod.io/#https://github.com/syvita/sypool"><img src="https://gitpod.io/button/open-in-gitpod.svg"/></a>

## How it works (simply)

Mining STX tokens is a game of numbers and probability. In order to mine profitably, an estimated ~1BTC is required initially. Many people don't have 1BTC to throw at a new miner, so we made this!

This 'pool' combines lots of people's Bitcoin together to mine STX profitably. You put Bitcoin in and get STX tokens out. You commit Bitcoin at our site, which will then add you to the list of contributors in the smart contract.

### Fee model

There is a 5% fee on profits. 20% of this fee is distributed to Sypool Collateral holders (when collateral gets activated).

If you contribute 1BTC and when you redeem your proportion of STX back you have 1.5BTC worth of STX, the fee will be `0.5BTC * 0.05 = 0.025BTC fee` so you would get 1.475BTC back.

### The Sypool ($SYPL) token

When you commit your sats, we'll send an equal amount of Sypool tokens to your Stacks address. If you contribute 500,000 sats, you get 500,000 Sypool tokens to your Stacks address.

What can you do with these tokens? You can vote on decisions that we as a community might make in the future, and more importantly, you can redeem your STX rewards.

After 1000 blocks (1 cycle), you'll be able to redeem your STX rewards. You might not make a profit after this 1000 block cooldown, as not all of your Bitcoin would have been spent for mining yet. Don't worry if you don't make a profit, as the miner will eventually use up all your BTC.

### *we got trust issues*

Understandably. We're as transparent as possible, and automate as much as we can so there's less grey area for us to go wrong.

Once you commit Bitcoin, after the cooldown, you can take your share out (if you want), even if all our services go down. This is ensured by the smart contract and requires no manual intervention from us.

The only trust is that we use the Bitcoin to mine. Basically everything else is automated and trustless through the contract. And if we don't use the Bitcoin to mine, 20% of the 5% fee goes towards collateral providers, to reduce risk (when activated).

![repo header gradient](readme-img/repo-header.png "repo header gradient")

## How does it *really* work?

**Warning: technical bits ahead**

Syvita's pool is not unique in that it is primarily controlled by a smart contract. However, it is unique in how it verifies contributions cross-chain through hashing, merkle roots and some other cool stuff. Big s/o to [Jude](https://github.com/jcnelson) at the Stacks Foundation for how this works. He wrote the majority of the Bitcoin library functions that the pool uses to verify contributions.

### From start to finish

First, a user that wants to contribute bitcoin hashes a `secret` with `SHA512`. This is generated in the UI client-side for ease-of-use. This hash is then added to the `HashMap`  in the smart contract through the public function `register-hash`. Once they've done this, the hash is stored along with the `tx-sender`, in this case, the Stacks address the user wants their rewards to be redeemable to.

Once the smart contract call confirmed and is ok, the user sends a Bitcoin transaction to add their Bitcoin to the pool's publicly known BTC address with `secret` in the `OP_RETURN` output of the transaction. This can be from any Bitcoin address or key, and doesn't have to be one tied to the Stacks redeem address.

Once *that* confirms on the BTC chain, the user calls the `reveal-hash` function with the transaction, a Merkle proof and `secret`. this function verifies that:

1. The transaction was mined on the Bitcoin chain using the Merkle proof (verifies it's a valid transaction)
2. `secret` is registered in `hash-map` that was stored in the first step (`secret` is needed for adding btc)
3. `SHA256(secret)` is in the OP_RETURN field of the passed transaction (makes sure you were the one who sent the transaction)
4. The transaction pays out to the known pool BTC address that's used to mine. (self-explanatory)

If all of those return ok, the contract extracts how many sats were added to the pool and mints that amount of Sypool fungible tokens to the `tx-sender` in `hash-map`.

Worth noting that these fields will be autofilled by the UI to improve ease-of-use, though can be set manually (if something goes wrong with the UI). The user will enter their txid once it has been mined, then the UI will pull the necessary info from a Bitcoin node. Also worth saying - all these values can be entered manually by you in the UI (or the [Stacks Explorer](https://explorer.stacks.co) even) if you don't trust what the UI is doing. UI is also open-source and in this repo for you to read through if you want :)

Cool. All done. And now for the (relatively) simpler mining process. The Bitcoin that's sent to the pool are then transferred to Stackers to try to win the ability to mine the block. If the miner wins this 'lottery' against other miners, the miner gets the block reward and all transaction fees in that.

The miner also will mine microblocks when it has won a block, which you can read more about [here](https://docs.blockstack.org/understand-stacks/mining#transaction-fees), along with other cool stuff for mining.

When the miner gets the rewards, it creates a transaction in that block that immediately sends the STX rewards to the smart contract. Over time, these will average out and make it so (hopefully) each user of the mining pool makes a healthy profit.

The 5% fee only applies on profit. The contract will get the current STX/BTC from Swapr and calculate how much profit you made, then charge the 5% fee on the profit you made. If you made a loss, the fee doesn't apply.

### Architecture

There are 6 parts to the mining pool infrastructure wise.

1. Sypool Engine (smart contract on the Stacks blockchain)
2. Sypool Collateral Engine (smart contract on the Stacks blockchain)
3. Website/UI
4. The Bitcoin node, used to spend Bitcoin with
5. Stacks node A, running in miner mode and connected to the local bitcoin node
6. Stacks nodes B, running in follower mode as a publicly available API.

The web UI will be hosted as a static Next.js site on Cloudflare's edge, alike other Syvita sites. The static site will make API requests to Stacks node B as default. The code for this site is in this repo.

The Bitcoin node & Stacks node A (the miner) will be hosted on a M1-based Mac Mini owned and managed by [Asteria](https://github.com/SyAsteria). This will be locally controlled and not accessable to the public internet as a private key to the pool Bitcoin wallet are held here. The Mac is connected only via a VPN, as to not expose the IP address, open any public ports to the machine and reduce the attack surface. The Bitcoin node is [Bitcoin Core](https://bitcoincore.org/) and the Stacks node is the [one created by Hiro](https://github.com/blockstack/stacks-blockchain).

Stacks node B will be run as a VM on [Bitlaunch](https://bitlaunch.io/). No private keys or funds are stored on this machine. It will be connected to requests to it via a [Cloudflare Argo Tunnel](https://www.cloudflare.com/en-gb/products/argo-tunnel/), to protect from attacks. This node runs [stacks-blockchain-api](https://github.com/blockstack/stacks-blockchain-api), created by [Hiro](https://hiro.so).

Both Stacks nodes will be updated as new releases of the Stacks node software are released. Stacks node B will have a 2nd VM booted and connected to Cloudflare until it has caught up with the chain, then traffic will be routed to it via Cloudflare and the other VM will be destroyed. Stacks node A will use a similar method, but will start a new instance on the same machine instead.
