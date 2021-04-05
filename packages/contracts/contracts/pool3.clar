;; created by @pxydn for the labs³ mining pool

;; Pool³ token and functions
;; the token implements the SIP-009 standard

(define-fungible-token P3)
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard.ft-trait')

;; get the token balance of owner
(define-read-only (balance-of (owner principal))
  (begin
    (ok (ft-get-balance P3 owner))))

;; returns the total number of tokens
(define-read-only (total-supply)
  (ok (ft-get-supply P3)))

;; returns the token name
(define-read-only (name)
  (ok "Pool³"))

;; the symbol or "ticker" for this token
(define-read-only (symbol)
  (ok "P3"))

;; the number of decimals used
(define-read-only (decimals)
  (ok u0))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq tx-sender sender)
    (ft-transfer? P3 amount sender recipient)
    (err u4)))

(define-read-only (get-token-uri) 
    (ok "https://x.labs3.co/ft/P3.json"))

;; addresses of the pool contracts and control addresses

(define-constant control-address "SP3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP7BEFRGE")
(define-constant pool-address "SP1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62SPF93CC")

(define-constant control-testnet-address "ST3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP5H2JRS0")
(define-constant pool-testnet-address "ST1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62VK43RFQ")

;; map for storing contributions to the pool

(define-map hash-map ((tx-sender principle) ((hash (buff 32))))
(define-map contributions ((address principle)) ((committed-at-block uint)))

(define-public (register-hash (hash (buff 32)))
    (map-insert hash-map tx-sender hash))

(define-public (reveal-hash (btc-txid (buff 64) (merkle-proof (buff 64) (secret))))
    ;; 1: verify transaction was mined on the Bitcoin chain using supplied Merkle proof
    ;; 2: verify that secret hashes to an entry in hash-map
    ;; 3: verify that Bitcoin transaction pays out to the expected Bitcoin address of the pool
    ;; 4: if 1,2,3 return true, continue, else return the respective error
    ;; 5: extract value sent in transaction
    ;; 6: mint P3 tokens to address and return (ok true)
)

;; all below code will probs be changed

;; requests to add a contribution by an address
;; only allows calls from the control addresses
(define-public (add-contribution (address principle) (amount uint))
    (if (is-eq contract-caller control-address)
        (if (map-insert contributions { address: address } { committed-at-block: block-height }) 
            (begin 
                ;; if insertion is successful mint P3 tokens to their address
                (ft-mint? P3 amount address) 
                (ok true)) 
            ;; fail if address already exists 
            (ok false))
        ;; fail if not from a control address    
        (ok false)))

;; requests to increase a contribution by an address
;; only allows calls from the control addresses
(define-public (increase-contribution (address principle) (amount uint))
    (if (is-eq contract-caller control-address)
        (begin 
            (ft-mint? P3 amount address)
            (ok true))
        (ok false)))

;; requests to redeem rewards for an address
(define-public (redeem-rewards)
    (if (>= (- block-height (unwrap! (map-get? contributions { address: contract-caller }))) 1000)
        (if (>= (ft-get-balance P3 contract-caller) 1000) 
            (begin
                (as-contract 
                    (stx-transfer? 
                        (* (* 0.9 (stx-get-balance (as-contract tx-sender))) 
                            (/ (ft-get-balance P3 contract-caller) 
                            (ft-get-supply P3))) 
                        tx-sender address))
                (ft-burn? P3 rewardAmount address)
                (ok true))
            ;; fail if address contributed less than 1000 sats
            (ok false))
        ;; fail if address contributed less than 1000 blocks before
        (ok false)))

(define-public (redeemFees)
    (if (is-eq contract-caller control-address) expr-if-true expr-if-false))
    ;; ... haven't finished this yet