# Contracts

- [x] `clarity-bitcoin` - library used to verify native transactions on Bitcoin
- [x] `sypool-pub2btc` - converts a secp256k1 public key into legacy, SegWit or native SegWit address
- [x] `sypool-oracle` - bridges offchain STX/BTC price data while we don't have chainlink integration
- [x] `sypool-treasury` - manages the mined STX

- [x] `sypool-cycles` - cycle functionality (handles phasing, datamaps, offchain data APIs too)
- [x] `sypool-core` - handles joining the pool
- [ ] `sypool-collateral` - handles pool collateral (not needed for launch)

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

## `sypool-cycles`

The 2nd largest contract - deals primarily with cycle functionality (duh). It handles the phasing, the primary datamaps and storage for Sypool. It also has some data APIs for onchain and read-only apps, but most of these are abstracted in `sypool-core` for ease of use.

### Public interface

#### `start-prepare-phase`

What do you think it does?

##### Arguments

None

##### Output

```lisp
(ok true)

OR

(err uXX)
```

#### `start-spend-phase`

What do you think it does?

##### Arguments

None

##### Output

```lisp
(ok true)

OR

(err uXX)
```

#### `get-latest-cycle-id`

What do you think it does?

##### Arguments

None

##### Output

```lisp
(ok uint)
```

#### `get-partittypants`

Returns a list of tuples containing principles, amounts and time (block) contributed for a specified cycle ID.

##### Arguments

```lisp
(cycleId uint)
```

##### Output

```lisp
(ok list)
```

#### `get-partittypant-data`

Returns a tuple with a specified partittypant's data over all time.

##### Arguments

```lisp
(partittypant principal)
```

##### Output

```lisp
(ok tuple)
```

### Private interface

## `sypool-core`

### Public interface

#### `register-me-daddy`

does stuff
adds contract-caller to the pool

TODO
FIGURE ME OUT

##### Arguments

```lisp
(signature (buff 65))
(block { 
    header: (buff 80), 
    height: uint 
}) 
(tx (buff 1024)) 
(proof { 
    tx-index: uint, 
    hashes: (list 12 (buff 32)), 
    tree-depth: uint 
})

TODO 

FIGURE THIS OUT!

```

##### Output

```lisp
(ok list)
```

#### `get-latest-cycle-id`

gets the latest cycle id

##### Arguments

None

##### Output

```lisp
(ok uint)
```

#### `get-cycle`

gets infOwO for a cycle and returns it as a tUwUple

##### Arguments

```lisp
(cycleId uint)
```

##### Output

```lisp
(ok tuple)
```

#### `get-partittypants`

Returns a list of tuples containing principles, amounts and time (block) contributed for a specified cycle ID.

##### Arguments

```lisp
(cycleId uint)
```

##### Output

```lisp
(ok list)
```

#### `get-partittypant-data`

Returns a tUwUple with a specified partittypant's datA(SS) over all time.

##### Arguments

```lisp
(partittypant principal)
```

##### Output

```lisp
(ok tuple)
```

#### `get-unfulfilled-return`

Returns the unfulfilled return of the current cycle for a specified partittypant.

##### Arguments

```lisp
(partittypant principal)
```

##### Output

```lisp
(ok uint)
```

```
-----------------------:+syyso+/yhsso+//::::-:::---............:oyhhhyyyys+:oyyyy/---......s+/------
------------------------:/+shysooossosooooo++/////++oosyyoo+/:...-:+shdhhyyyyyyhho---...../syhy+----
---------------------:+ossooossysoosss++/:::///:--.....-:+syyyso+/-.--/shdhhhyhhyys+/....:sossdds:--
------------------:/+o////++oooosooos/:/+oyhdhhysoss+/:-..--/oyyysso+:--:+shddhhyho++-../hysosssso++
----------------:+o/:--:/+ooo++osssys+++/::/osyhysoshhyy+:---:/+syyssss+/::/syhyyho--..ohhhssyso/::/
---::::://::::-:+:--:--/oo/::/++//shys++oo+----:+yhyooyhhy+:::++oosyys+sys+/:/shs+oo/-ohys/::/+sys+:
:///:::::::/ssssooo/-:+o:--://:--/yyhhy+:/oso:----/syy++shhys++ossoosysooshhhyy+oo::+shdh+:/+//+syhs
..........-oyyyhhho://:-.--:-----s/odysyy/-:sho:---:oyys//sddhyo/oyhysyyhhhysyhs//o:-/oshdyoosso+shd
.........:syyyhhs+:::...-----:--:h:ohhy+yhs:-/yh+::/+syhhs//sddhh+/ohhyyyys+//:oys/+//oo+ohdhsosyssh
........:yyyhhyo+:::-------//-://d:/hhhs+yyy///shhoooooshhhs++yhyho:/shhyys/-...:oys/:/shysshhyysssy
.......:syyhs+so/-/:/:---:oo-:o:sm//yhyys+yyhoooohdssyhyo+oyhy++ysso-/syysdho-../-/sho//+yhdyyhhdho+
/:-.``-syydh/ys/:o++/--::oy::s+:yms+oyyyss+yhhsoo+yd+/syhhys+oyhsyo:+-syysoshyo/:+:ssys/:/ohhdyhhdyo
syhyo/oyyhd/oyo:o+y+::/+sd/:os++hmhoooyhy+s+yddo/:-sh--shyyydhs+sdd//sydmys+/+oshhhhys+o/::+yhdhymms
-oyyyhhyhdo/hs/++hy++ooydh//hhoodhd+:-:sdh/::ods--..os.:yyyhhhddoody+hsddy+oydhhdhyo/yy/::::/yhdhymy
--+yhhhhdh:oho:s+hsoooohmh++dh++dyyy--.-/hd+-/sd/---/y+/shyydddddyyh/shhss+:+yds++::::yh/:::::shdhhh
---/shhhd/-hy-:sohsoooodms:ody-:hhshy:---/ydy/osyo/+odo:/dhyhhdmddyhshd+/oyhyoyh/-+:--:sh:-:++:shdyh
..--:yydy:/d/--s/hyo+/+dm+-+dh--smyddho:-:::oyho/+osyyy+:/hysydmddhhhdy/:::/syydy:/+:--:hy:-/so/ydh+
...-+yhd/:oy-.-s/oy+:::hd/:odd:-+mdhdhdhsos/://+syhhy+ys//+yysdmyhdy+syyo+///+/+dy:so---om+-+oys+hho
..../sys:/so...oh/ys+::ydy//hmso/hmhdyydmddyo+/::////++o///+yyhdsdddyo///+oyds++hmsoh:--:dy-/yosyhhy
.....-y/:+s/---osy+:/+shdy::omd++ommho+sddhhhdhyssoo+oossoooyhhmhydmmmddddyyhdddhhdsd+---sd::yy+sddy
o/:-./s:sos:---ssohyo++shdo++smo//yddho/+ydhhhyyhhhddhmmmho/:+yhdddddhyso/::/++++sdddo---om+-shs:shy
-/+hsysssos::--+s/oyhhyo/sho//oy///hdhds/:/yhhy++yy+s++hhhyso//+ooyy/-....-:..-+o-ymmo-:-omo:yhhy+sh
-:+hohsdyoy/s///h///sh+///yy/::+s/:+yhsss/::+yhy//hs/yo+yhs/ssyy+o+/:.+/-:yy:ohmo/yNh:/--sd+/hhsyhoy
-:yoodhdhoyso+:+yo/::yy/::+hh+::os:o++hho+o/-:hds-yd/shsossy+o+-....-omdhdmmhsdmddhd/o/--hd:shy::ydy
-+s+sdhdhyhds+:+yy/://hy/:/ydmo::hy:yo+ddysh/-/mh:smoyy-.../+:..-++syoo/:.--.----:ysds--/dhyhy:-+yhd
:soyhmdmhyhmdo+:yy+:::/hy::/hdm/-smohdoydd/yd//hmoymho-.......:oyyo-.............oshd:--ymdhsy/:syhm
:hsdhmhmhhdhmho//yy+:::/do:-ommy/dm+ddhhyhhyhhohdy+/:.........-//...............+syds--odhs::oy+hyhd
+hhhsmhmhhmosddo::+ys/::sd:-/dNmhmNmmmmhysds+++:-..............................-y/hms:oyo/:-::shhhdo
syyy+dhdhhm+:/ody/::/s:-/ds+yNNNmmhsomhhhmNNmdy/:..............................:y/ymd+/:::::::/yhds/
yyoy/hmydhm+::+dy:o/:/ho:hhsmNNh+///ymhodmhhdhys+-.............................-y/smmo:::::::/+/yhyy
hy+y+hmhydm+::+dy:/yo:odyhmmmho///:/hds++ss+s+oyo..----.........................os/mmd+/::/:::os+sdh
hs/sohdmydm++:/dy:-/d+/hmhmmdo///::::://:::---+s+..:--/:........................:doohmms::o+:/:sdssy
hs+osdddddmos::hh:--dsydNddhs:::::--.oy/-.-:+/:-....:://.........................+dyhdm+/:+h+/o/ymhs
yoo/yhmdhdmys:-om/-+dhhhmddy/----...../soo+:........:/-..........................-hyhmy/+//sh++ysydh
soo+ysmdddmhh:-:dy:ss+:-+yhdho-.-..../ss/...........-//:.............--...-...-.-syohmh+os+/hhsoshdd
+y/oshdddmmhd+--+doso-----/+osy+//+++o/--...........................:+-...---/--+yohmdmdoyyoohdhysss
-+soshddhmmdds---/hyds:---:o/-:+++//---....................--:/++oo+o-.-------::y/sddhhmhsdh+/sdddhh
-:/syyddhdhhdd:----+yhho:--:ss/-/ossyo:................:+syyhhyhhs-...--------:oshddodhmmyhddo::+syh
---:ohdddd+dddy:-----/yhhs/--sho--odsshs-...........//+h+syyyyhh+.....:hh:-::/s/.::-/dmmmhhddddhyyyh
-----/hNmyhdmddh::/---:shhhhhssho--/dyohy:.............+hyyhhy+-.....-hms---/s/.....+mNmhyymdhyhhyyo
------:+dssshmdddooyo:-:/shyyhhdd+--/dyshy-.............:+++:.......-shm/-.:so-..../hyyyhyydhh+sds:.
-------/h:oyhddhdddhhds:--:+o+/smd/--ohyhh/.........................+ydmo--ss:....:dhyhhyhdhhdds:-..
------:osohdhsdhooyddddh/---:ss/sms:::syhh+........................-yodyohyo:....-yhyyyyhhyyhy/-....
---://shshydo:hd+-/ydyshd+/--:ohohd::::/hhs+:-..--:+-............../yys/sy/-....-ohyyyo//oyh+-.....-
---::///oyhdo:+hh/::+yyhmdy::-:shhh::o::hddhhysssydh:---..........-y:--ss-......+yyyo///os+-.....-::
--------oyyoosoosyys/::ymdd//+:oddy::so:shh+++oyhdmdhyso+//:---.../s..+y-.....-/yyy+//os+-......:/:-
---/oo/-/yoo-:/+/ohhhysdddy:yy:+dddo:/yo+hhyhdNmddysmmdhhhhyyso/::s:.-oy-.....:syy+/+o+-......-oho..
--:+sss+:+yh/-----+symmmdmo/hh::shdds/+hsshdyyhdmNNdmNNmhyyyyyhhyyo-../h:.....:yy+/++-......-+hms-..
-/sssssso/:/o+:---/hshmydddoyNy//+yhhhsshddmNNNNNNNMNMNmsyhyhhyhds-.../h/....-/sy+:-......./hNmo-...
-:+osssssso+//:--:osodddydmmhmNNhyssyydNmmNMMMMNNNNNMNNNh/shdmmmd:...-/h/...:o/:-........:smNdo-....
----:://///+/::+shysohyydmNMMNMMMMMMMMMMNNNNNNNNNNNNNmhm/+:oddNNy....-sd/..-+-.........:yNMNd/-....-
--------------:/++/--:osmNNNMMMMMMMMMMNNNNNNNNNNNNNNmNdNmho-odmNy.....:y-.-:.........-omMMNy:.....:y
```