from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

import json
import base64

def get_signature(object, ownPrivateKey):
    with open(ownPrivateKey, "r") as fh:
        key = fh.read()
    ownPrivateKey = RSA.import_key(key)

    object = base64.b64encode(json.dumps(object, separators=(',', ':')).encode())
    sign = SHA256.new(object)
    signer = pkcs1_15.new(ownPrivateKey)
    signature = signer.sign(sign)
    return base64.b64encode(signature).decode("utf-8")

def check_signature(object_info, signature, theirPublicKey):
    with open(theirPublicKey, "r") as fh:
        key = fh.read()
    theirPublicKey = RSA.import_key(key)
    object_info = json.dumps(object_info, separators=(',', ':'))
    object_info = base64.b64encode(str(object_info).encode())

    try:
        hash = SHA256.new(object_info)
        verifier = pkcs1_15.new(theirPublicKey)
        verifier.verify(hash, base64.b64decode(signature))
        return True
    except Exception as err:
        print(err)
        return False

if __name__ == "__main__":
    value = {"text": "This is a very private message"}
    signature = get_signature(value, "../../DevelopmentTestKeys/HA.pem")
    validSignature = check_signature(value, signature , "../../DevelopmentTestKeys/HA_public.pem")
    print(validSignature)
