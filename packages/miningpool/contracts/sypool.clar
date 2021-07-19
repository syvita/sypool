;; created by Asteria for the Syvita mining pool (https://sypool.co)

;; error codes

(define-constant ERR_TX_VERIFICATION_FAILED u1)
(define-constant ERR_TOKEN_MINT_FAILURE u2)
(define-constant ERR_UNAUTHORIZED u3)
(define-constant ERR_COLLATERAL_ENGINE_ALREADY_SET u4)
(define-constant ERR_BITCOIN_TX_VERIFICATION_ERROR u5)
(define-constant ERR_HASH_NOT_REGISTERED u6)
(define-constant ERR_DOESNT_PAY_2_POOL u7)
(define-constant ERR_CONTRIBUTION_BELOW_MINIMUM u8)
(define-constant ERR_COULD_NOT_VERIFY_SECRET u9)
(define-constant ERR_COULD_NOT_GET_TX_OUTS u10)
(define-constant ERR_COULD_NOT_GET_TX_SENDER u11)
(define-constant FIRST_CYCLE u697450)

(define-constant FEE_PRINCIPLE 'SP343J7DNE122AVCSC4HEK4MF871PW470ZSXJ5K66)
(define-constant POOL_BTC_ADDRESS 0x123456)
(define-constant POOL_BTC_SCRIPT_PUB_KEY (concat (concat 0xa914 POOL_BTC_ADDRESS) 0x87))

(define-data-var collateralEngine principal 'SP000000000000000000002Q6VF78)
(define-data-var hasCollateralEngineBeenSet bool false)

;; maps

(define-map HashMap {hash: (buff 32)} {tx-sender: principal})
(define-map Contributions {address: principal} {committed-at-block: uint})
(define-map BTCTxs {txId: (buff 32)} {revealed: bool})

;; cycle functionality

(define-constant PREPARE_PHASE_CODE u1)
(define-constant SPEND_PHASE_CODE u2)

(define-constant INITIAL_PREPARE_PHASE_PERIOD u1050)
(define-constant INITIAL_SPEND_PHASE_PERIOD u1050)

(define-constant PREPARE_PHASE_PERIOD u150)
(define-constant SPEND_PHASE_PERIOD u1950)

(define-constant BTC_TX_FEE u10000) ;; how much miner spends on BTC tx fees per block in sats

(define-data-var currentPhase uint u0)
(define-data-var latestCycleId uint u0)
(define-data-var cycleParticipants (optional list) none)

(define-map Cycles ;; stores previous cycles
    { id: uint } 
    { 
        totalParticipants: uint,
        totalBtcSpent: uint, ;; in satoshis
        totalStxReturned: uint, ;; in microstacks
        startedAtBlock: uint
    }
)

(define-public (start-prepare-phase)
    (begin
        ;; TODO: make sure prepare phase is triggered on a correct block

        (var-set latestCycleId (+ (var-get latestCycleId) u1))
        (var-set currentPhase PREPARE_PHASE_CODE)
        (ok true)
    )
)

(define-public (start-spend-phase)
    (begin
        (asserts! (is-eq currentPhase PREPARE_PHASE_CODE) (err u0))
        ;; TODO: calculate spending for this cycle
        ;;   total (cycleTotalBtc)
        ;;   average per block
        ;; TODO: calculate cycleTotalParticipants
        (asserts!
            (map-insert
                { id: (var-get latestCycleId) }
                {
                    totalParticipants: cycleTotalParticipants,
                    totalBtcSpent: cycleTotalBtc, ;; in satoshis
                    totalStxReturned: u0, ;; in microstacks
                    startedAtBlock: (- block-height PREPARE_PHASE_PERIOD)
                }
            )
        (err u0))
        (var-set currentPhase SPEND_PHASE_CODE)
        (ok true)
    )
)

(define-read-only (get-latest-cycle-id)
    (ok latestCycleId)
)

(define-read-only (get-latest-cycle)
    (ok (map-get? Cycles latestCycleId))
)

(define-read-only (get-previous-cycle (cycleId uint))
    (begin
        ;; if cycleId is latest cycle fail
        (asserts! (not (is-eq cycleId latestCycleId)) (err u0))
    )
)

;; private functions

(define-private (check-block (phase uint))
    (if (is-eq phase u1)
        (if (is-eq (mod (- block-height FIRST_CYCLE) u2100) u0) 
            true 
            false
        )
        (if (is-eq phase u2)
            (if (is-eq (mod (- block-height (+ FIRST_CYCLE u150)) u2100) u0) 
                true 
                false
            )
            false ;; isn't phase 1 or 2
        )
    )
)

(define-private (scriptpubkey-to-p2pkh (scriptPubKey (buff 128)))
    (hash160 (sha256 scriptPubKey)))

(define-private (verify-secret (secret (buff 32)))
    (is-some (map-get? HashMap { hash: (sha256 secret)})))

(define-private (verify-individual-out (out { value: uint, scriptPubKey: (buff 128) }) (result bool))
    (or result (is-eq (scriptpubkey-to-p2pkh (get scriptPubKey out)) POOL_BTC_ADDRESS)))

(define-private (get-outs-from-tx (tx (buff 1024)))
    (fold verify-individual-out
        (get outs (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) (err ERR_BITCOIN_TX_VERIFICATION_ERROR))) ;; returns a list of tuples of outs of tx
        false ;; if none are verified to be to the pool, return false), otherwise true
    )
)

(define-private (get-individual-out-value (out { value: uint, scriptPubKey: (buff 128) }) (result uint))
  (if (is-eq (get scriptPubKey out) POOL_BTC_ADDRESS_AS_SCRIPT_PUB_KEY)
    (get value out)
    result))

(define-private (get-contribution-value (tx (buff 1024)))
    (fold get-individual-out-value
        (get outs (unwrap (contract-call? .clarity-bitcoin parse-tx tx) (err ERR_BITCOIN_TX_VERIFICATION_ERROR))) ;; returns a list of tuples of outs of tx
        u0
    ) ;; this is only designed to accept one output in a tx and only uses fold bc it's passed as a list
)

(define-private (get-stx-price-in-sats)
    ;; this should return the stx price in sats as a response type, eg - (ok u3380)
    ;; needs to use an oracle of some sort but haven't finalised the details here
    (ok u3380) ;; will be changed
)

(define-private (get-caller-rewards) ;; returns the total amount of STX of the contract-caller
    (ok (* 
        (/ (ft-get-balance SYPL contract-caller) (ft-get-supply SYPL)) 
        (stx-get-balance (as-contract tx-sender))
    ))
)

(define-private (get-caller-profits) ;; in microstacks
    (ok 
        (- (get-caller-rewards) (/ (ft-get-balance SYPL contract-caller) (get-stx-price-in-sats)))    
    )
)

(define-private (user-has-made-profit)
    (if
        (> 
            (* 
                (unwrap-panic (get-caller-rewards)) 
                (unwrap-panic (get-stx-price-in-sats))
            ) 
            (ft-get-balance SYPL contract-caller)
        )
        (ok true)
        (ok false)
    )
)

;; public functions

;; registers a separate collateral engine smart contract to the pool
(define-public (register-collateral-engine (enginePrincipal principal))
    (if (not (var-get hasCollateralEngineBeenSet))
        (if 
            (is-eq contract-caller FEE_PRINCIPLE)
            (begin
                (var-set collateralEngine enginePrincipal)
                (var-set hasCollateralEngineBeenSet true)
                (ok true))
            (err ERR_UNAUTHORIZED)
        )
        (err ERR_COLLATERAL_ENGINE_ALREADY_SET)
    )
)

;; registers a hashed secret with a stacks address to provide rewards to
(define-public (register-hash (hash (buff 64)))
    (ok (map-insert HashMap {hash: hash} {tx-sender: tx-sender})))

;; 'activates' rewards for a stacks address

;; verifies that the contribution indeed happened, the secret provided hashes 
;; to a stacks address for rewards and that the contribution was to the pool

(define-public (reveal-hash (btcBlock { header: (buff 80), height: uint }) (rawTx (buff 1024)) (merkleProof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint }) (secret (buff 32)))
    (if 
        (and 
            ;; 1: verify transaction was mined on the Bitcoin chain using supplied Merkle proof
            (asserts! (unwrap-err! (contract-call? .clarity-bitcoin was-tx-mined?
                btcBlock
                rawTx
                merkleProof
            )) (err ERR_MERKLE_PROOF_INVALID))
            ;; 2: verify that secret hashes to an entry in HashMap
            (asserts! (verify-secret secret) (err ERR_HASH_NOT_REGISTERED))
            ;; 3: verify that Bitcoin transaction pays out to the expected Bitcoin address of the pool (not done yet)
            (asserts! (unwrap! (get-outs-from-tx rawTx) (err ERR_COULD_NOT_GET_TX_OUTS)) (err ERR_DOESNT_PAY_2_POOL))
            ;; TODO - 4: verify that Bitcoin transaction has an OP_RETURN output of the hashed secret
        )

        ;; if no errors occurred, continue to append their contribution to cycleParticipants
        ;; TODO - remove sypool token, use list instead
        (if (>= (get-contribution-value rawTx) u1000)
            (begin
                (unwrap-panic (ft-mint? SYPL (get-contribution-value rawTx) (unwrap! (get tx-sender (map-get? HashMap { hash: (sha256 secret)})) (err ERR_COULD_NOT_GET_TX_SENDER))))
                (ok true)
            )
            (err ERR_CONTRIBUTION_BELOW_MINIMUM)
        )
    )
)

;; redeems rewards for an address
(define-public (redeem-rewards (address principal) (rewardAmount uint))
    (if (>= (- block-height (unwrap-panic (get committed-at-block (map-get? Contributions { address: contract-caller })))) u1000)
        (if (>= (ft-get-balance SYPL contract-caller) u1000)
            (begin
                (as-contract
                    (if (is-eq (var-get hasCollateralEngineBeenSet) false)
                        ;; if collateral engine is NOT active
                        (begin
                            (if (user-has-made-profit)
                                ;; if user has made profit
                                (begin
                                    ;; user receives 95% of profit + all non-profit
                                    (unwrap-panic (stx-transfer? (+ 
                                        (/ (* u95 (unwrap-panic (get-caller-profits))) u100) 
                                        (- (get-caller-rewards) (get-caller-profits)))
                                        (as-contract tx-sender) contract-caller
                                    ))
                                    ;; 5% of profit to pool owner
                                    (unwrap-panic (stx-transfer? (/ 
                                        (* u5 (unwrap-panic (get-caller-profits))) 
                                        u100)
                                        contract-caller FEE_PRINCIPLE
                                    ))
                                )
                                ;; if user hasn't made profit
                                (begin
                                    ;; user receives their proportion of rewards, no fee
                                    (unwrap-panic (stx-transfer? (+ 
                                        (/ (* u95 (unwrap-panic (get-caller-profits))) u100) 
                                        (- (get-caller-rewards) (get-caller-profits)))
                                        (as-contract tx-sender) contract-caller
                                    ))
                                )
                            )
                        )
                        ;; if collateral IS active
                        (begin
                            (begin
                                (if (user-has-made-profit)
                                    (begin
                                        ;; user receives 95% of profit + all non-profit
                                        (unwrap-panic (stx-transfer? (+ 
                                            (/ (* u95 (unwrap-panic (get-caller-profits))) u100) 
                                            (- (get-caller-rewards) (get-caller-profits)))
                                            (as-contract tx-sender) contract-caller
                                        ))
                                        ;; 4% of profit to pool owner
                                        (unwrap-panic (stx-transfer? (/ 
                                            (* u4 (unwrap-panic (get-caller-profits))) 
                                            u100)
                                            contract-caller FEE_PRINCIPLE
                                        ))
                                        ;; 1% of profit to collateral providers
                                        (unwrap-panic (stx-transfer? (/ 
                                            (* u1 (unwrap-panic (get-caller-profits))) 
                                            u100)
                                            contract-caller collateralEngine
                                        ))
                                    )
                                    (begin
                                        ;; user receives their proportion of rewards, no fee
                                        (unwrap-panic (stx-transfer? (+ 
                                            (/ (* u95 (unwrap-panic (get-caller-profits))) u100) 
                                            (- (get-caller-rewards) (get-caller-profits)))
                                            (as-contract tx-sender) contract-caller
                                        )) 
                                    )
                                )
                            )
                        )
                    )
                (unwrap-panic (ft-burn? SYPL rewardAmount address))
                (ok true))
            ;; fail if address contributed less than 1000 sats
            (ok false))
        ;; fail if address contributed less than 1000 blocks before
        (ok false)
        )
    )
)