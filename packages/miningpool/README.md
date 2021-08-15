# Contracts

- [x] `clarity-bitcoin` - library used to verify native transactions on Bitcoin
- [x] `sypool-pub2btc` - converts a secp256k1 public key into legacy, SegWit or native SegWit address
- [x] `sypool-oracle` - bridges offchain STX/BTC price data while we don't have chainlink integration
- [] `sypool-treasury` - manages the mined STX

- [] `sypool-cycles` - cycle functionality (handles phasing, datamaps, offchain data APIs too)
- [] `sypool-core` - handles joining the pool
- [] `sypool-collateral` - handles pool collateral (not needed for launch)

## `sypool-pub2btc`

### Public interface

#### `verify-bitcoin-address` *read-only*

This takes a secp256k1 signature, a target Bitcoin address and a SHA256 hash to verify the signature came from the address.

It uses the native `secp256k1-recover?` Clarity function to recover the public key, then matches the passed bitcoin address to its type to attempt to derive an address from the public key. if this address matches the one passed, the function returns `(ok true)`. If it doesn't, it'll throw an error detailing the point where it went wrong.

##### Arguments

```lisp
(signature (buff 65))
(btcAddress (buff 100))
(hash (buff 32))
```

##### Output

```lisp
(ok bool)
```

#### `get-bitcoin-address-type` *read-only*

This takes a Bitcoin address as a buffer and returns the type of address.

This is able to identify:

1. P2PKH (legacy, start with '1')
2. P2SH (start with '3')
3. P2WPKH, AKA Bech32 (start with 'bc1')

##### Arguments

```lisp
(address (buff 100))
```

##### Output

```lisp
(ok 'p2pkh' || 'p2sh' || 'p2wpkh')
```

### Private interface

#### `get-p2pkh`

Calculates the P2PKH address of a secp256k1 public key.

##### Arguments

```lisp
(publicKey (buff 33))
```

##### Output

```lisp
(address (buff 100))
```

#### `get-p2sh`

Calculates the P2SH address of a secp256k1 public key.

##### Arguments

```lisp
(publicKey (buff 33))
```

##### Output

```lisp
(address (buff 100))
```

#### `get-p2wpkh`

Calculates the P2WPKH address of a secp256k1 public key.

##### Arguments

```lisp
(publicKey (buff 33))
```

##### Output

```lisp
(address (buff 100))
```

## `sypool-oracle`

### Public interface

#### `get-price` *read-only*

Returns the STX price in satoshis (BTC) for a block.

##### Arguments

```lisp
(blockHeight uint)
```

##### Output

```lisp
(price uint)
```

#### `add-price` *public*

Allows the deployer to add a price for a block. It can be a previous block or the current, but prices cannot be overwritten.

##### Arguments

```lisp
(blockHeight uint)
(price uint)
```

##### Output

```lisp
(ok true)

OR

(err uXX)
```

### Private interface

#### `authenticate-caller`

Verifies that the `contract-caller` is the deployer of the oracle contract.

##### Arguments

None

##### Output

```lisp
true || false
```

## `sypool-treasury`

The treasury contract is where all Stacks-based assets are stored. This is where the mined STX is sent by the miner. It handles all operations for assets stored for the pool, including paying out to members, fee logic & some collateral logic.

### Public interface

The treasury's interface is not accessible to anything outside of the specified contracts, like the collateral contracts and cycles contract. Functions in this contract are mostly for moving around the funds, which needs to be trustless - which is why the contract only allows calls to its functions by authorised principles.

#### `payout`

This function pays out mined STX to a specified principle for a specified mining cycle. 

It calculates the fee using the internal fee logic and then sends the STX from the treasury contract's balance directly to the specified principle.

##### Arguments

```lisp
(principle principle)
(cycle uint)
```

##### Output

```lisp
(ok true)

OR

(err uXX)
```

### Private interface

#### `authenticate-caller`

Verifies that the `contract-caller` is an authorised principle.

##### Arguments

None

##### Output

```lisp
true || false
```

#### `calculate-fee`

This calculates a fee for a specified principle for a specified cycle. It calls into `sypool-cycles` to get the mining stats for that cycle, then calls to the oracle to get the current STX price in satoshis - from there, a fee is calculated and returned as a uint.

This function will never error.

##### Arguments

```lisp
(principle principle)
(cycle uint)
```

##### Output

```lisp
uint
```

