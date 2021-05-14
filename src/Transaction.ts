const Elliptic = require('elliptic').ec;
const ec = new Elliptic('secp256k1');
const SHA256 = require('crypto-js').SHA256;

export class Transaction {
  public fromAddress: string;
  public toAddress: string;
  public amount: number;
  private timestamp: number;
  public signature: string;

  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
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
      return false;
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

