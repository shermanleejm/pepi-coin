const Block = require('./Block');
const Transaction = require('./Transaction');

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

    for (let trx of this.pending) {
      if (trx.signature === transaction.signature) {
        throw new Error('Duplicate transaction');
      }
    }
    console.log('added new transaction');
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

module.exports = Blockchain;
