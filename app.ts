import express, { Request, Response } from "express";
import { Block, Blockchain, Transaction, P2pserver } from "./src";

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const blockchain = new Blockchain();
const p2pserver = new P2pserver(blockchain);

// display all blocks
app.get("/blocks", (req: Request, res: Response) => {
  return res.status(200).json(blockchain.chain);
});

// add transaction
app.post("/add-transaction", (req, res) => {
  if (req.body.private === undefined) {
    return res.json("Please provide a private key");
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

app.post("/mine", (req, res) => {
  if (req.body.toAddress === undefined)
    return res.json("please provide an toAddress for reward");

  try {
    blockchain.minePending(req.body.toAddress);
  } catch (err) {
    return res.json(err.message);
  }

  res.redirect("/blocks");
});

app.listen(port, () => {
  console.log(`pepi coin listening at http://localhost:${port}`);
});

p2pserver.listen();