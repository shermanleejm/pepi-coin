const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 6969;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pserver {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  connectSocket(socket) {
    this.sockets.push(socket);
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });

    server.on('connection', (socket) => this.connectSocket(socket));

    this.connectToPeers();
  }
}

module.exports = P2pserver;
