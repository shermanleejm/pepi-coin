const Elliptic = require("elliptic").ec;
const ec = new Elliptic("secp256k1");
import { Blockchain, Transaction } from "./src";

// TESTING
const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log(publicKey);
// 045c68da8f4794dbd55cf487697d1e5cef2c2878584e8bd2e6a19ab50dcaf36bd7c455c665e2e1fb140712f2cbf2b7d9575da21cd0fdf579c4c90717bb7c3c9997
console.log(privateKey);
// cfcaa368a29d93c989a6a0879e9ef693319f0d6decc843725c99ce879e8523d5

const alphaChain = new Blockchain();

const myPrivateKey =
  "cfcaa368a29d93c989a6a0879e9ef693319f0d6decc843725c99ce879e8523d5";
const myAddress =
  "045c68da8f4794dbd55cf487697d1e5cef2c2878584e8bd2e6a19ab50dcaf36bd7c455c665e2e1fb140712f2cbf2b7d9575da21cd0fdf579c4c90717bb7c3c9997";

const tx1 = new Transaction(myAddress, "Recipient Address", 10);
tx1.signTransaction(myPrivateKey, myAddress);

console.log(JSON.stringify(tx1));

console.log(tx1.isValid());

// alphaChain.addTransaction(tx1);

// alphaChain.minePending(myAddress);

// console.log(alphaChain.getBalanceOfAddress(myAddress));

// console.log(alphaChain.chain);
