import { eddsa } from 'elliptic';
const ec = new eddsa('ed25519');
const SHA256 = require('crypto-js').SHA256;

export class Transaction {
  public fromAddress: null | string;
  public toAddress: string;
  public amount: number;
  private timestamp: number;
  public signature: string | undefined;

  constructor(fromAddress: string | null, toAddress: string, amount: number) {
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

  signTransaction(privateKey: string, publicKey: string) {
    if (publicKey !== this.fromAddress) {
      throw new Error('Wrong public key!!!!!');
    }

    const hashTransaction = this.calculateHash();
    const signature = ec.keyFromSecret(privateKey).sign(hashTransaction).toHex();
    this.signature = signature;
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      return false;
    }

    const publicKey = ec.keyFromPublic(this.fromAddress);
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
