import express from 'express';
import { app, p2pserver } from './src/App';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`pepi coin listening at http://localhost:${port}`);
});

p2pserver.listen();
