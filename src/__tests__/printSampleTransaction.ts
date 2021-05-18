import { eddsa } from 'elliptic';
const ec = new eddsa('ed25519');
import { Blockchain, Transaction } from '..';
import { wordList, getRandom, generateKeyPair } from '../utils';

// TESTING
const myPrivateKey =
  'basiradial,myoneural,helipterum,otoconite,tipman,bestripe,provocant,cava,spitballer,rhagonate,khasa,spyproof,july,earsore,dishling,carob,marimonda,relatively,puff,proroguer,excusative,nonburning,sevenbark,mazdakean,gaia';

const key = ec.keyFromSecret(myPrivateKey);

const publicKey = key.getPublic('hex');

// console.log(publicKey);
// 045c68da8f4794dbd55cf487697d1e5cef2c2878584e8bd2e6a19ab50dcaf36bd7c455c665e2e1fb140712f2cbf2b7d9575da21cd0fdf579c4c90717bb7c3c9997
// console.log(myPrivateKey);
// cfcaa368a29d93c989a6a0879e9ef693319f0d6decc843725c99ce879e8523d5

const tx1 = new Transaction(publicKey, 'Recipient Address', 10);
tx1.signTransaction(myPrivateKey, publicKey);

console.log(
  JSON.stringify({
    amount: 10,
    fromAddress: publicKey,
    toAddress: 'Recipient Address',
    private: myPrivateKey,
  })
);

console.log(tx1.isValid());


