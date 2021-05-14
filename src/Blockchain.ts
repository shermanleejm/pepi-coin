import { Block } from './Block';
import { Transaction } from './Transaction';

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private pending: Transaction[];
  private reward: number;
  private maxTransactionLength: number = 1

  constructor() {
    this.chain = [this.createFirstBlock()];
    this.difficulty = 2;
    this.pending = [];
    this.reward = 100;
  }

  createFirstBlock() {
    return new Block(Date.now(), []);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePending(rewardAddress) {
    // cant mine unless pending reaches size of this.maxTransactionLength or more
    if (this.pending.length < this.maxTransactionLength) {
      throw new Error('Nothing to mine');
    }

    // create reward transaction
    const rewardTransaction = new Transaction(null, rewardAddress, this.reward);

    this.pending.push(rewardTransaction);

    let block = new Block(
      Date.now(),
      this.pending,
      this.chain[this.chain.length - 1].hash
    );
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

    for (let trx of this.pending) {
      if (trx.signature === transaction.signature) {
        throw new Error('Duplicate transaction');
      }
    }

    for (let block of this.chain) {
      for (let trx of block.transactions) {
        if (trx.signature === transaction.signature) {
          throw new Error('Duplicate transaction');
        }
      }
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

  replaceChain(newChain) {
    if (newChain.length >= this.chain.length && newChain.isValid()) {
      this.chain = newChain;
    } else {
      console.log('invalid replacement chain');
    }
  }
}