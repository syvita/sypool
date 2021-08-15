;; built by asteria for sypool



(define-read-only (verify-bitcoin-address 
        (signature (buff 65))
        (btcAddress (buff 100))
        (hash (buff 32))
    )
    (begin
        (if () () ())
    )
)

;; this contract can identify:
;;  1. P2PKH (legacy, start with '1')
;;  2. P2SH (start with '3')
;;  3. P2WPKH, AKA Bech32 (start with 'bc1')
;; Base58Check encoding is used for encoding byte arrays in Bitcoin 
;; into human-typable strings. this processes using Base58Check

(define-read-only (get-bitcoin-address-type (address (buff 100)))
    (if ((is-eq (element-at address u0) 0x00)) ;; P2PKH
        (ok 'p2pkh') 
        (if ((is-eq (element-at address u0) 0x02)) expr-if-true expr-if-false))
)