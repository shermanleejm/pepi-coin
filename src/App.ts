import express, { Request, Response } from 'express';
import { Blockchain, Transaction, P2pserver } from '.';
import { ADD_TRANSACTION_ROUTE, BLOCKS_ROUTE, MINE_ROUTE } from './const';

export const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const blockchain = new Blockchain();
export const p2pserver = new P2pserver(blockchain);

// display all blocks
app.get(BLOCKS_ROUTE, (req: Request, res: Response) => {
  return res.status(200).json(blockchain.chain);
});

// add transaction
app.post(ADD_TRANSACTION_ROUTE, (req, res) => {
  if (req.body.private === undefined) {
    return res.json('Please provide a private key');
  }

  let transaction = new Transaction(
    req.body.fromAddress,
    req.body.toAddress,
    req.body.amount
  );
  transaction.signTransaction(req.body.private, req.body.fromAddress);

  try {
    blockchain.addTransaction(transaction);
  } catch (err) {
    return res.status(418).json(err.message);
  }
  res.status(200).json(blockchain.pending);
});

app.post(MINE_ROUTE, (req, res) => {
  if (req.body.toAddress === undefined)
    return res.json('please provide an toAddress for reward');

  try {
    blockchain.minePending(req.body.toAddress);
  } catch (err) {
    return res.json(err.message);
  }

  p2pserver.broadcastChain();

  res.redirect(BLOCKS_ROUTE);
});
