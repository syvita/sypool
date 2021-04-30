;; Pool³ Collateral (P3C) engine
;; the token implements the SIP-010 standard

;; this token (P3C) manages collateral for the mining pool
;; collateral contributors can allocate a wrapped Bitcoin token to the
;; pool to ensure security, and are allocated 1% of profits in return

;; this is very similar to the Pool³ token, but without the 
;; crosschain verification methods that are needed to verify native BTC
;; transactions on the Stacks chain. Rewards sent to this contract are 
;; in the form of STX tokens that are sent when holders of the Pool³ token
;; redeem their rewards. They are sent from the Pool³ smart contract (engine),
;; though it will accept STX from anyone, so anyone (or any contract) can tip
;; the collateral providers.

(define-fungible-token P3C)
;; the token implements the SIP-010 standard
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard.ft-trait')

;; get the token balance of owner
(define-read-only (balance-of (owner principal))
  (begin
    (ok (ft-get-balance P3C owner))))

;; returns the total number of tokens
(define-read-only (total-supply)
  (ok (ft-get-supply P3C)))

;; returns the token name
(define-read-only (name)
  (ok "Pool³ Collateral"))

;; the symbol or "ticker" for this token
(define-read-only (symbol)
  (ok "P3C"))

;; the number of decimals used
(define-read-only (decimals)
  (ok u0))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq tx-sender sender)
    (ft-transfer? P3C amount sender recipient)
    (err u4)))

(define-read-only (get-token-uri) 
    (ok "https://x.<labs3domain>/ft/P3C.json"))

(define-read-only (get-collateral-pool-ratio)
    (ok (* (/ (total-supply) (ft-get-supply P3)) 100 )))

;; public functions for adding/removing collateral

(define-public (add-collateral (amountInXBTC uint)) 
    (begin 
        (ft-mint? P3C amountInXBTC tx-sender)
        (ok true)
    )
)

(define-public (refund-collateral (amountInXBTC uint))
    (begin 
        (ft-burn? P3C amountInXBTC tx-sender)
        (ok true)
    )
)