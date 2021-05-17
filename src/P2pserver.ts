import { Blockchain } from './Blockchain';

export class P2pserver {
  private P2P_PORT = process.env.P2P_PORT || 6969;

  // TODO: set up DNS server and update
  private peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

  private blockchain: Blockchain;
  private sockets: string[];

  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  connectSocket(socket) {
    this.sockets.push(socket);
  }

  connectToPeers() {
    this.peers.forEach((peer) => {
      let ws = require('ws');
      const socket = ws(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  listen() {
    let ws = require('ws');
    const server = ws.Server({ port: this.P2P_PORT });

    server.on('connection', (socket) => this.connectSocket(socket));

    this.connectToPeers();
  }
}
