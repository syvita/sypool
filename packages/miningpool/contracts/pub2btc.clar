;; built by asteria for sypool

;; this takes a secp256k1 signature, a target bitcoin address and
;; a sha256 hash to verify the signature came from the address. 

;; it uses the native secp256k1-recover? to recover the public key,
;; then matches the passed bitcoin address to its type to attempt to
;; derive an address from the public key. if this address matches the
;; one passed, the function returns (ok true). if it doesn't, it'll throw
;; an error detailing the point where it went wrong.

(define-read-only (verify-bitcoin-address 
        (signature (buff 65))
        (btcAddress (buff 100))
        (hash (buff 32))
    )
    (begin
        (if () () ())
    )
)
igm
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