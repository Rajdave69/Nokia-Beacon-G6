# Payload Encryption

Found in scripts.js

1. Plaintext `k` (string) is converted into an SJCL bitArray via `sjcl.codec.utf8String.toBits(k)`.
2. AES key and IV are randomly generated:
	- `U = sjcl.random.randomWords(4, 0)` → 4 × 32‑bit words = 128‑bit AES key.
	- `W = sjcl.random.randomWords(4, 0)` → 128‑bit AES IV.
3. AES‑CBC encryption:
	- `L = new sjcl.cipher.aes(U)` creates an AES cipher.
	- `M = sjcl.mode.cbc.encrypt(L, S, W)` encrypts the plaintext bits `S` using the key `U` and IV `W`. The result `M` is the ciphertext bitArray.

4. RSA encryption of the AES key and IV:
	- The key and IV are converted to standard Base64 strings: `x.fromBits(U)` and `x.fromBits(W)` (where `x = sjcl.codec.base64`).
	- They are concatenated with a space: `Q = keyBase64 + " " + ivBase64`.
	- `v = new JSEncrypt()` creates an RSA encryptor.
	- `v.setPublicKey(R)` loads the provided RSA public key (PEM string).
	- `t0 = v.encrypt(Q)` encrypts the concatenated string with RSA (PKCS#1 v1.5). The result is a Base64‑encoded RSA ciphertext.

5. Final encoding:
	- The AES ciphertext `M` is encoded as Base64URL (no `+`, `/`, `=`) using `sjcl.codec.base64url.fromBits(M)` → stored as `ct`.
	- The RSA ciphertext `t0` is further transformed by a custom escaping function `e()`:
		```
		function e(str) {
    			return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
		}
		```
	This replaces `+` → `-`, `/` → `_`, `=` → `.` (a variant of Base64URL with a dot instead of padding). The result is stored as ck.


Decryption Helper: The code also provides `aes_decrypt` which uses a stored AES key/IV (retrieved from `localStorage`) to decrypt a given ciphertext (presumably for client‑side decryption of server responses). It does not use RSA on the client side; RSA is used only for encrypting the symmetric key on the client, while decryption is done server‑side (or client‑side with a pre‑stored symmetric key).


