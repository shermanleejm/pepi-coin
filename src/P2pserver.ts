import { Blockchain } from "./Blockchain";
import ws from "ws";

const P2P_PORT = parseInt(process.env.P2P_PORT || "6969");
// TODO: set up DNS server and update
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export class P2pserver {
  private blockchain: Blockchain;
  private sockets: ws[];

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  connectSocket(socket: ws) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);

    // TODO: send only the blocks that they are missing
    socket.send(JSON.stringify(this.blockchain));
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new ws(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  listen() {
    const server = new ws.Server({ port: P2P_PORT });

    server.on("connection", (socket: ws) => this.connectSocket(socket));

    this.connectToPeers();
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
  }

  messageHandler(socket: ws) {
    socket.on("message", (message: string) => {
      let data = JSON.parse(message);
      console.log("data", data);
    });
  }
}
