import { Index, Sequelize } from 'sequelize-typescript';
import {seedDb} from './db/db';
import { dbConf } from './db/dbconf';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import 'dotenv/config'
import express  from 'express';
import { createServer } from 'http';
import{Server} from 'socket.io'
import loginRouter from './routes/login';
import initRouter from './routes/initOutlets';
import lightRouter from './routes/lights';
import outletRouter from './routes/outlets';
import { Elcontrol } from './models/models';
import { SocketEmitter } from './modbushandles/EmitClass';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, IOutlet } from './@types';
import cors from 'cors';
import initLightsRouter from './routes/initLights';
import initOutletsRouter from './routes/initOutlets';
import ModbusRTU from "modbus-serial";
import { delay } from './modbushandles/modbushandle';
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU';
import path from 'path';

const app = express();


app.use(cors());
app.use(express.json());
app.use(loginRouter)
app.use(initLightsRouter)
app.use(initOutletsRouter)
app.use(lightRouter)
app.use(outletRouter)
// add middlewares
const root = require('path').join(__dirname, 'public');
app.use(express.static(root));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const httpserver = createServer(app);
let kwhs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
export const client = new ModbusRTU();


(async () => {


 
await client.connectRTUBuffered("/dev/ttyAMA2", { baudRate: 9600 })
client.setTimeout(5000);
console.log('dirname',__dirname)
 // const usr= await Users.findAll()
 // console.log('usr',usr)

})();


 export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpserver,{
  cors: {
    origin:'*'
  },
}); 

httpserver.listen(1111, () => {
  console.log(`Server is running on port ${1111}`);
});
const sequelize = new Sequelize(dbConf);


(async () => {


 
  await sequelize.sync({force: true});
  await seedDb()
 // const usr= await Users.findAll()
 // console.log('usr',usr)

})();
/*   io.on("connection",async (socket) => {
  console.log('socket connected')
  let counter
  if(client.isOpen)
  {
    try
    {
    client.setID(1)
    await delay(10)
  counter= await client.readHoldingRegisters(210,2)
console.log('counter',counter)
  socket.emit('watts',1,counter.data[1])
    }
    catch(e:any){
   
      await delay(2000)

      counter=await client.readHoldingRegisters(outlet1consumption,2)
 
      console.log(counter)

    }  
}
});   */
const outlet1consumption=210

export async function readwatts(times:number):Promise<void>{
 // console.log('trying',times)
  
  
  try{
    client.setID(1)
    const counter= await client.readHoldingRegisters(outlet1consumption,2)
    io.emit('watts',1,counter.data[1])
 //   console.log('from periodical',counter)
    await delay(100);
    client.setID(10)
    const res= await client.readDiscreteInputs(0,16)
   // console.log('from status',res.data)
    setTimeout(() => readwatts(10), 5000);
  }
  catch(e:any)
  {
    console.log(e.message)
    if(times>0)
    {
      if(!client.isOpen)
      {
        await client.connectRTUBuffered("/dev/ttyAMA2", { baudRate: 9600 });
       
      }
    
     times= times-1
      await delay(1000)
      return await readwatts(times)

    }
  }

}
setTimeout(() => {
  readwatts(10) 
}, 1000);


   app.get(
    "/protected",
    expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] }),
    function (req: JWTRequest, res: express.Response) {
      console.log('authreq',req.auth)
      if ( !req.auth) return res.sendStatus(401);
      res.sendStatus(200);
    }
  );


