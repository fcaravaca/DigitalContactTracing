var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

function generateSignature(text, ownPrivateKey){

    const buffer = Buffer.from(text).toString("base64");
    const privateKey = fs.readFileSync(path.resolve(ownPrivateKey), "utf8");

    const signature = crypto.sign("sha256", buffer, {
        key: privateKey,
    });

    return signature.toString('base64');
}


function checkSignature(text, signature, theirPublicKey){
    console.log(text, signature, console.log(theirPublicKey))
    const buffer = Buffer.from(text).toString("base64")
    console.log(buffer)
    const publicKey = fs.readFileSync(path.resolve(theirPublicKey), "utf8");

    const isVerified = crypto.verify(
        "sha256", buffer, {
          key: publicKey,
        }, Buffer.from(signature, "base64")
    );
    console.log("Signature:", isVerified)
    return isVerified
}


module.exports = {
    generateSignature,
    checkSignature
}