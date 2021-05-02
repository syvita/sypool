;; Sypool Collateral (SYPLC) engine
;; the token implements the SIP-010 standard

;; this token (SYPLC) manages collateral for the mining pool
;; collateral contributors can allocate a wrapped Bitcoin token to the
;; pool to ensure security, and are allocated 1% of profits in return

;; this is very similar to the Sypool token, but without the 
;; crosschain verification methods that are needed to verify native BTC
;; transactions on the Stacks chain. Rewards sent to this contract are 
;; in the form of STX tokens that are sent when holders of the Sypool token
;; redeem their rewards. They are sent from the Sypool smart contract (engine),
;; though it will accept STX from anyone, so anyone (or any contract) can tip
;; the collateral providers.

(define-fungible-token SYPLC)
;; the token implements the SIP-010 standard
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard.ft-trait')

;; get the token balance of owner
(define-read-only (balance-of (owner principal))
  (begin
    (ok (ft-get-balance SYPLC owner))))

;; returns the total number of tokens
(define-read-only (total-supply)
  (ok (ft-get-supply SYPLC)))

;; returns the token name
(define-read-only (name)
  (ok "Sypool Collateral"))

;; the symbol or "ticker" for this token
(define-read-only (symbol)
  (ok "SYPLC"))

;; the number of decimals used
(define-read-only (decimals)
  (ok u0))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (if (is-eq tx-sender sender)
    (ft-transfer? SYPLC amount sender recipient)
    (err u4)))

(define-read-only (get-token-uri) 
    (ok "https://x.syvita.org/ft/SYPLC.json"))

(define-read-only (get-collateral-pool-ratio)
    (ok (* (/ (total-supply) (ft-get-supply P3)) 100 )))

;; public functions for adding/removing collateral

(define-public (add-collateral (amountInXBTC uint)) 
    (begin 
        (ft-mint? SYPLC amountInXBTC tx-sender)
        (ok true)
    )
)

(define-public (refund-collateral (amountInXBTC uint))
    (begin 
        (ft-burn? SYPLC amountInXBTC tx-sender)
        (ok true)
    )
)