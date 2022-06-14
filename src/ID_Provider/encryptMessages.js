var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

function encryptMessage(text, ownPrivateKey, theirPublicKey){

    const publicKey = fs.readFileSync(path.resolve(theirPublicKey), "utf8");
    const buffer = Buffer.from(text);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);


    const privateKey = fs.readFileSync(path.resolve(ownPrivateKey), "utf8");

    const signature = crypto.sign("sha256", encrypted, {
        key: privateKey,
    });

    return {encryptedData: encrypted.toString("base64"), signature: signature.toString("base64")};
}


function decryptMessage(ciphertext, signature, ownPrivateKey, theirPublicKey){
    const privateKey = fs.readFileSync(path.resolve(ownPrivateKey), "utf8");
    const buffer = Buffer.from(ciphertext, "base64")
    const decrypted = crypto.privateDecrypt(privateKey, buffer);

    const publicKey = fs.readFileSync(path.resolve(theirPublicKey), "utf8");

    const isVerified = crypto.verify(
        "sha256", Buffer.from(ciphertext, "base64"), {
          key: publicKey,
        }, Buffer.from(signature, "base64")
      );
    console.log(decrypted.toString("utf8"))
    if(isVerified){
        return decrypted.toString("utf8");
    }else{
        return undefined
    }
}


module.exports = {
    encryptMessage,
    decryptMessage
}