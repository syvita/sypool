;; created by @pxydn

;; metapool token and functions
;; redundant functions are for requests offchain

(define-fungible-token metapool)

(define-read-only  (get-pool-total)
    (ft-get-supply metapool))

(define-read-only (get-address-contribution (address principle)) 
    (ft-get-balance metapool address))

;; addresses of the pool and control addresses

(define-constant control-address "SP3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP7BEFRGE")
(define-constant pool-address "SP1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62SPF93CC")

(define-constant control-testnet-address "ST3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP5H2JRS0")
(define-constant pool-testnet-address "ST1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62VK43RFQ")

;; map for storing contributions to the pool

(define-map contributions { address: principle } { committed-at-block: uint })

;; requests to add a contribution by an address
;; only allows calls from the control addresses
(define-public (add-contribution (address principle) (amount uint))
    (if (is-eq contract-caller control-address)
        (if (map-insert contributions { address: address } { committed-at-block: block-height }) 
            (begin 
                ;; if insertion is successful mint metapool tokens to their address
                (ft-mint? metapool amount address) 
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
            (ft-mint? metapool amount address)
            (ok true))
        (ok false)))

;; requests to redeem rewards for an address
(define-public (redeem-rewards)
    (if (>= (- block-height (unwrap! (map-get? contributions { address: contract-caller }))) 1000)
        (if (>= (ft-get-balance metapool contract-caller) 1000) 
            (begin
                (as-contract 
                    (stx-transfer? 
                        (* (* 0.9 (stx-get-balance (as-contract tx-sender))) 
                            (/ (ft-get-balance metapool contract-caller) 
                            (ft-get-supply metapool))) 
                        tx-sender address))
                (ft-burn? metapool rewardAmount address)
                (ok true))
            ;; fail if address contributed less than 1000 sats
            (ok false))
        ;; fail if address contributed less than 1000 blocks before
        (ok false)))

(define-public (redeemFees)
    (if (is-eq contract-caller control-address) expr-if-true expr-if-false))
    ;; ... haven't finished this yet