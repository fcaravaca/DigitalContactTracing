from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256






def get_ciphertext_and_signature(text, ownPrivateKey, theirPublicKey):
    with open(ownPrivateKey, "r") as fh:
        key = fh.read()
    ownPrivateKey = RSA.import_key(key)

    with open(theirPublicKey, "r") as fh:
        key = fh.read()
    theirPublicKey = RSA.import_key(key)

    cipher = PKCS1_v1_5.new(theirPublicKey)
    ciphertext = cipher.encrypt(text.encode())

    sign = SHA256.new(ciphertext)
    signer = pkcs1_15.new(ownPrivateKey)
    signature = signer.sign(sign)
    return ciphertext, signature

def get_text_from_ciphertext_and_signature(ciphertext, signature, ownPrivateKey, theirPublicKey):
    with open(ownPrivateKey, "r") as fh:
        key = fh.read()
    ownPrivateKey = RSA.import_key(key)

    with open(theirPublicKey, "r") as fh:
        key = fh.read()
    theirPublicKey = RSA.import_key(key)

    try:
        hash = SHA256.new(ciphertext)
        verifier = pkcs1_15.new(theirPublicKey)
        verifier.verify(hash, signature)

        cipher = PKCS1_v1_5.new(ownPrivateKey)
        text = cipher.decrypt(ciphertext, None)
        return text
    except:
        return None

if __name__ == "__main__":
    ciphertext, signature = get_ciphertext_and_signature("This is a very private message", "../../DevelopmentTestKeys/HA.pem", "../../DevelopmentTestKeys/LP1_public.pem")
    real_text = get_text_from_ciphertext_and_signature(ciphertext, signature , "../../DevelopmentTestKeys/LP1.pem", "../../DevelopmentTestKeys/HA_public.pem")
    print(real_text)