import crypto from "crypto";
import fs from "fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

console.log("privateKey", privateKey);
console.log("publicKey", publicKey);

fs.writeFileSync("src/certs/private.pem", privateKey);
fs.writeFileSync("src/certs/public.pem", publicKey);
