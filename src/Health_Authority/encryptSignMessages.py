from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

import json
import base64

def get_ciphertext_and_signature(object, ownPrivateKey, theirPublicKey):
    with open(ownPrivateKey, "r") as fh:
        key = fh.read()
    ownPrivateKey = RSA.import_key(key)

    with open(theirPublicKey, "r") as fh:
        key = fh.read()
    theirPublicKey = RSA.import_key(key)

    cipher = PKCS1_OAEP.new(theirPublicKey)
    ciphertext = cipher.encrypt(json.dumps(object).encode())

    sign = SHA256.new(ciphertext)
    signer = pkcs1_15.new(ownPrivateKey)
    signature = signer.sign(sign)
    return base64.b64encode(ciphertext).decode("utf-8"), base64.b64encode(signature).decode("utf-8")

def get_text_from_ciphertext_and_signature(ciphertext, signature, ownPrivateKey, theirPublicKey):
    with open(ownPrivateKey, "r") as fh:
        key = fh.read()
    ownPrivateKey = RSA.import_key(key)

    with open(theirPublicKey, "r") as fh:
        key = fh.read()
    theirPublicKey = RSA.import_key(key)

    try:
        hash = SHA256.new(base64.b64decode(ciphertext))
        verifier = pkcs1_15.new(theirPublicKey)
        verifier.verify(hash, base64.b64decode(signature))

        cipher = PKCS1_OAEP.new(ownPrivateKey)
        text = cipher.decrypt(base64.b64decode(ciphertext))
        return text.decode()
    except Exception as err:
        print(err)
        return None

if __name__ == "__main__":
    ciphertext, signature = get_ciphertext_and_signature("This is a very private message", "../../DevelopmentTestKeys/HA.pem", "../../DevelopmentTestKeys/LP1_public.pem")
    real_text = get_text_from_ciphertext_and_signature(ciphertext, signature , "../../DevelopmentTestKeys/LP1.pem", "../../DevelopmentTestKeys/HA_public.pem")
    print(real_text)