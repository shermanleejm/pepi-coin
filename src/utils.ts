import wordList from './words.json';
const EDDSA = require('elliptic').eddsa;
const eddsa = new EDDSA('ed25519');

function getRandom(arr: string[], n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function generateKeyPair(secret: string) {
  const chainUtil = eddsa.keyFromSecret(secret);
  const keyPair = chainUtil.getPublic('hex');

  return chainUtil;
}

function generateMerkelRoot(trxHashes: string[]) {
  if (trxHashes.length % 2 != 0) {
    trxHashes.push(trxHashes[trxHashes.length - 1]);
  }
}

export { wordList, getRandom, generateKeyPair };
