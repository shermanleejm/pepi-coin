const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Blockchain = require('./src/Blockchain');
const Transaction = require('./src/Transaction');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const blockchain = new Blockchain();

// display all blocks
app.get('/blocks', (req, res) => {
  return res.json(blockchain.chain);
});

// add transaction
app.post('/add-transaction', (req, res) => {
  const transaction = new Transaction(
    req.body.fromAddress,
    req.body.toAddress,
    req.body.amount,
    req.body.signature,
    req.body.timestamp
  );

  try {
    transaction.isValid();
  } catch (err) {
    if (req.body.signature !== undefined) {
      return res.json('Please sign the transaction with the correct private key');
    }
  }

  blockchain.addTransaction(transaction);
  res.json(blockchain.pending);
});

app.listen(port, () => {
  console.log(`pepi coin listening at http://localhost:${port}`);
});
