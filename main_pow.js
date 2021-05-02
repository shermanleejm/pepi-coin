const SHA256 = require('crypto-js/sha256');
const Elliptic = require('elliptic').ec;
const ec = new Elliptic('secp256k1');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(privateKey, publicKey) {
    if (publicKey !== this.fromAddress) {
      throw new Error('Wrong public key!!!!!');
    }

    const hashTransaction = this.calculateHash();
    const signature = ec.keyFromPrivate(privateKey).sign(hashTransaction, 'base64');
    this.signature = signature.toDER('hex');
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature present for this transaction.');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
  }

  isValid() {
    for (let tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createFirstBlock()];
    this.difficulty = 2;
    this.pending = [];
    this.reward = 100;
    this.maxTransactionLength = 1;
  }

  createFirstBlock() {
    return new Block(Date.now() / 1000, []);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePending(rewardAddress) {
    // cant mine unless pending reaches size of this.maxTransactionLength or more
    if (this.pending.length < this.maxTransactionLength) {
      return;
    }

    // create reward transaction
    const rewardTransaction = new Transaction(null, rewardAddress, this.reward);

    // add reward transaction to transactions to verify
    const stuffToVerify = this.pending.splice(
      this.pending.length - this.maxTransactionLength,
      this.pending.length
    );
    stuffToVerify.push(rewardTransaction);

    // fix the number of transactions that are mined in each block
    let block = new Block(Date.now(), stuffToVerify);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction addresses are missing!!!');
    }

    if (!transaction.isValid()) {
      throw new Error('Invalid transaction!!!');
    }

    this.pending.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions || []) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (!currBlock.isValid()) {
        return false;
      }

      if (currBlock.hash !== currBlock.calculateHash()) {
        return false;
      }

      if (currBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

// TESTING
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log(publicKey);
// 045c68da8f4794dbd55cf487697d1e5cef2c2878584e8bd2e6a19ab50dcaf36bd7c455c665e2e1fb140712f2cbf2b7d9575da21cd0fdf579c4c90717bb7c3c9997
console.log(privateKey);
// cfcaa368a29d93c989a6a0879e9ef693319f0d6decc843725c99ce879e8523d5

const alphaChain = new Blockchain();

const myPrivateKey = 'cfcaa368a29d93c989a6a0879e9ef693319f0d6decc843725c99ce879e8523d5';
const myAddress =
  '045c68da8f4794dbd55cf487697d1e5cef2c2878584e8bd2e6a19ab50dcaf36bd7c455c665e2e1fb140712f2cbf2b7d9575da21cd0fdf579c4c90717bb7c3c9997';

const tx1 = new Transaction(myAddress, 'Recipient Address', 10);
tx1.signTransaction(myPrivateKey, myAddress);
alphaChain.addTransaction(tx1);

alphaChain.minePending(myAddress);

console.log(alphaChain.getBalanceOfAddress(myAddress));

console.log(alphaChain.chain);
