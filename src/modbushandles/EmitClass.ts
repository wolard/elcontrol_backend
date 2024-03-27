import { Socket } from "socket.io";
import initRouter from "../routes/initOutlets";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../@types';
export class SocketEmitter {

socket:Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>|undefined
constructor() {


  }
  initConnection(socket:Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>)
  {
    this.socket=socket

  }
  emitSocket(){
if(this.socket)
{
    console.log('emitting')
    this.socket.emit('noArg')
} 
}
}