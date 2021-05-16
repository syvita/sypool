;; created by Asteria for the Syvita mining pool (https://pool.syvita.org)

;; Sypool ($SYPL) engine

;; this token is the primary token of the pool
;; it manages native Bitcoin contributions to the pool that will be used to mine
;; SYPL token holders are allocated 95% of profits

;; during redemption of rewards:
;;    if the user has made a profit, they theoretically get 100% worth of what they put in
;;    and 95% of the profit they made on top. 5% is taken as a fee which is split 4:1 to @pxydn's
;;    known address (SP343J7DNE122AVCSC4HEK4MF871PW470ZSXJ5K66) and the configured collateral engine (if active)
;;
;;    if the user made a loss, they get their percentage back, and no profits (obv). the pool
;;    doesn't take fees on losses.

;; error codes

(define-constant ERR_TX_VERIFICATION_FAILED u1)
(define-constant ERR_TOKEN_MINT_FAILURE u2)
(define-constant ERR_UNAUTHORIZED u3)
(define-constant ERR_COLLATERAL_ENGINE_ALREADY_SET u4)
(define-constant ERR_BITCOIN_TX_VERIFICATION_ERROR u5)
(define-constant ERR_HASH_NOT_REGISTERED u6)
(define-constant ERR_DOESNT_PAY_2_POOL u7)
(define-constant ERR_CONTRIBUTION_BELOW_MINIMUM u8)

(define-constant POOL_STX_ADDRESS 'SP343J7DNE122AVCSC4HEK4MF871PW470ZSXJ5K66)
(define-constant POOL_BTC_ADDRESS "omitted till release ;)")
(define-data-var collateralEngine principal 'SP000000000000000000002Q6VF78)
(define-data-var hasCollateralEngineBeenSet bool false)

(define-fungible-token SYPL)
;; the token implements the SIP-010 standard
;; (impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard.ft-trait')

;; get the token balance of owner
(define-read-only (balance-of (owner principal))
  (begin
    (ok (ft-get-balance SYPL owner))))

;; returns the total number of tokens
(define-read-only (total-supply)
  (ok (ft-get-supply SYPL)))

;; returns the token name
(define-read-only (name)
  (ok "Sypool"))

;; the symbol or "ticker" for this token
(define-read-only (symbol)
  (ok "SYPL"))

;; the number of decimals used
(define-read-only (decimals)
  (ok u0))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq tx-sender sender)
    (ft-transfer? SYPL amount sender recipient)
    (err u4)))

(define-read-only (get-token-uri) 
    (ok "https://x.syvita.org/ft/SYPL.json"))

;; map for storing contributions to the pool

(define-map HashMap {hash: (buff 32)} {tx-sender: principal})
(define-map Contributions {address: principal} {committed-at-block: uint})

;; private functions

(define-private (scriptpubkey-to-p2pkh (scriptPubKey (buff 128)))
    (ok (hash160 (sha256 scriptPubKey)))

(define-private (verify-secret (secret (buff 32)))
    (ok (is-some (map-get? HashMap { hash: (sha256 secret)}))))

(define-private (verify-individual-out (out { value: uint, scriptPubKey: (buff 128) }))
    (ok (is-eq (scriptpubkey-to-p2pkh (get scriptPubKey out)) POOL_BTC_ADDRESS)))

(define-private (get-outs-from-tx (tx (buff 1024)))
    (fold verify-individual-out
        (get outs (unwrap! (contract-call? .clarity-bitcoin parse-tx tx))) ;; returns a list of tuples of outs of tx
        (ok false) ;; if none are verified to be to the pool, return (ok false), otherwise (ok true)
    )
)

(define-private (get-individual-out-value (out { value: uint, scriptPubKey: (buff 128) }))
    (ok (get value out)))

(define-private (get-contribution-value (tx (buff 1024)))
    (fold get-individual-out-value
        (get outs (unwrap! (contract-call? .clarity-bitcoin parse-tx tx))) ;; returns a list of tuples of outs of tx
        (ok u0)
    ) ;; this is only designed to accept one output in a tx and only uses fold bc it's passed as a list
)

(define-private (get-stx-price-in-sats)
    ;; this should return the stx price in sats as a response type, eg - (ok u3380)
    ;; needs to use an oracle of some sort but haven't finalised the details here
)

(define-private (get-caller-rewards) ;; returns the total amount of STX of the contract-caller
    (ok (* 
        (/ (ft-get-balance SYPL contract-caller) (ft-get-supply SYPL)) 
        (stx-get-balance (as-contract tx-sender))
    ))
)

(define-private (get-caller-profit) ;; returns the profit in STX of the contract-caller
    ;; profit = caller rewards - initial cost
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
            (is-eq contract-caller POOL_STX_ADDRESS)
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

;; Sypool tokens are minted 1:1 to sats contributed to the pool btc address. 
;; rewards are calculated based on the proportion of sats user has contributed overall

(define-public (reveal-hash (btcBlock { header: (buff 80), height: uint }) (rawTx (buff 1024)) (merkleProof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint }) (secret (buff 32)))
    (if 
        (and 
            ;; 1: verify transaction was mined on the Bitcoin chain using supplied Merkle proof
            (asserts! (unwrap! (contract-call? .clarity-bitcoin was-tx-mined?
                btcBlock
                rawTx
                merkleProof
            )) (err ERR_MERKLE_PROOF_INVALID))
            ;; 2: verify that secret hashes to an entry in HashMap
            (asserts! (unwrap! (verify-secret secret)) (err ERR_HASH_NOT_REGISTERED))
            ;; 3: verify that Bitcoin transaction pays out to the expected Bitcoin address of the pool (not done yet)
            (asserts! (unwrap! (get-outs-from-tx rawTx)) (err ERR_DOESNT_PAY_2_POOL))
        )

        ;; if no errors occurred, continue to mint SYPL tokens
        (if (>= (get-contribution-value rawTx) u1000)
            (begin
                (unwrap-panic (ft-mint? SYPL (get-contribution-value rawTx) (unwrap! (get tx-sender (map-get? HashMap { hash: (sha512 secret)})) (err ERR_TOKEN_MINT_FAILURE))))
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
                                        (/ (* u95 (unwrap-panic (get-caller-profit))) u100) 
                                        (- (get-caller-rewards) (get-caller-profits)))
                                        (as-contract tx-sender) contract-caller
                                    ))
                                    ;; 5% of profit to pool owner
                                    (unwrap-panic (stx-transfer? (/ 
                                        (* u5 (unwrap-panic (get-caller-profit))) 
                                        u100)
                                        contract-caller POOL_STX_ADDRESS
                                    ))
                                )
                                ;; if user hasn't made profit
                                (begin
                                    ;; user receives their proportion of rewards, no fee
                                    (unwrap-panic (stx-transfer? (+ 
                                        (/ (* u95 (unwrap-panic (get-caller-profit))) u100) 
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
                                            (/ (* u95 (unwrap-panic (get-caller-profit))) u100) 
                                            (- (get-caller-rewards) (get-caller-profits)))
                                            (as-contract tx-sender) contract-caller
                                        ))
                                        ;; 4% of profit to pool owner
                                        (unwrap-panic (stx-transfer? (/ 
                                            (* u4 (unwrap-panic (get-caller-profit))) 
                                            u100)
                                            contract-caller POOL_STX_ADDRESS
                                        ))
                                        ;; 1% of profit to collateral providers
                                        (unwrap-panic (stx-transfer? (/ 
                                            (* u1 (unwrap-panic (get-caller-profit))) 
                                            u100)
                                            contract-caller collateralEngine
                                        ))
                                    )
                                    (begin
                                        ;; user receives their proportion of rewards, no fee
                                        (unwrap-panic (stx-transfer? (+ 
                                            (/ (* u95 (unwrap-panic (get-caller-profit))) u100) 
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