import { Transaction } from './Transaction';

const SHA256 = require('crypto-js').SHA256;

export class Block {
  private timestamp: number;
  public transactions: Transaction[];
  public previousHash: string;
  public hash: string;
  private nonce: number;

  public constructor(timestamp: number, transactions: Transaction[], previousHash = '') {
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

  mineBlock(difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
  }

  isValid() {
    for (var tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}
