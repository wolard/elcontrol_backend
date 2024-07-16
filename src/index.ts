import { Index, Sequelize } from 'sequelize-typescript';
import { seedDb } from './db/db';
import { dbConf } from './db/dbconf';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'
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
import { ReadCoilResult, } from 'modbus-serial/ModbusRTU';
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
console.log('dirname',__dirname)
app.use(express.static(root));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const httpserver = createServer(app);

const readStatus = async (): Promise<ReadCoilResult> => {
  client.setID(10)
  return await client.readDiscreteInputs(0, 16)
}
const sequelize = new Sequelize(dbConf);
export let outlets: IOutlet[]
export const client = new ModbusRTU();
(async () => {
  client.connectRTUBuffered("/dev/ttyAMA2", { baudRate: 9600 })
  client.setTimeout(1000)
  await sequelize.sync({ force: true });
  await seedDb()
  const statuses = await readStatus()
  const outletsfromdb = await Elcontrol.findAll({ raw: true, where: { groupname: 'pistorasiat' } })
  outlets = outletsfromdb.map((out) => {
    return { ...out, status: statuses.data[out.relay - 1] };
  }
  )
})();


export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpserver, {
  cors: {
    origin: '*'
  },
});

httpserver.listen(1111, () => {
  console.log(`Server is running on port ${1111}`);
});


io.on("connection", async (socket) => {


});
app.get(
  "/protected",
  expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] }),
  function (req: JWTRequest, res: express.Response) {
    console.log('authreq', req.auth)
    if (!req.auth) return res.sendStatus(401);
    res.sendStatus(200);
  }
);


