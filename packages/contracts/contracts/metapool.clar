;; created by @pxydn

;; metapool token and functions
;; redundant functions are for requests offchain

(define-fungible-token metapool)

(define-read-only  (getPoolTotal)
    (ft-get-supply metapool))

(define-read-only (getAddressContribution (address principle)) 
    (ft-get-balance metapool address))

;; addresses of the pool and control addresses

(define-constant controlAddress "SP3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP7BEFRGE")
(define-constant poolAddress "SP1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62SPF93CC")

(define-constant controlTestnetAddress "ST3HXQGX95WRVMQ3WESCMC4JCTJPJEBHGP5H2JRS0")
(define-constant poolTestnetAddress "ST1N6FAZTJZ360QAZGRDCJC2S38RZ1EZ62VK43RFQ")

;; map for storing contributions to the pool

(define-map contributions { address: principle } { committedAtBlock: uint })

;; requests to add a contribution by an address
;; only allows calls from the control addresses
(define-public (addContribution (address principle) (amount uint))
    (if (is-eq contract-caller controlAddress)
        (if (map-insert contributions { address: address } { committedAtBlock: block-height }) 
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
(define-public (increaseContribution (address principle) (amount uint))
    (if (is-eq contract-caller controlAddress)
        (begin 
            (ft-mint? metapool amount address)
            (ok true))
        (ok false)))

;; requests to redeem rewards for an address
(define-public (redeemRewards)
    (if (>= (- block-height (unwrap! (map-get? contributions { address: contract-caller }))) 1000)
        (if (>= (ft-get-balance metapool contract-caller) 1000) 
            (begin
                (var-set rewardAmount (* (* 0.9 (stx-get-balance (as-contract tx-sender))) (/ (ft-get-balance metapool contract-caller) (ft-get-supply metapool))))
                (as-contract (stx-transfer? rewardAmount tx-sender address))
                (ft-burn? metapool rewardAmount address)
                (ok true))
            ;; fail if address contributed less than 1000 sats
            (ok false))
        ;; fail if address contributed less than 1000 blocks before
        (ok false)))
