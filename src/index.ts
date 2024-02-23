import { Sequelize } from 'sequelize-typescript';
import {seedDb} from './db/db';
import { dbConf } from './db/dbconf';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import 'dotenv/config'
import express  from 'express';
import cors from 'cors'
import loginRouter from './routes/login';
import initRouter from './routes/init';
import lightRouter from './routes/light';
const app = express();
app.use(cors());
app.use(express.json());
app.use(loginRouter)
app.use(initRouter)
app.use(lightRouter)

import http from 'http';
const server = http.createServer(app);

import{Server} from 'socket.io'

export const io = new Server(server,{
  cors: {
    origin: "*",
  },
});
 
server.listen(1111, () => {
  console.log(`Server is running on port ${1111}`);
});
const sequelize = new Sequelize(dbConf);
(async () => {

  await sequelize.sync({force: true});
  await seedDb()
 // const usr= await Users.findAll()
 // console.log('usr',usr)

})();



   app.get(
    "/protected",
    expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] }),
    function (req: JWTRequest, res: express.Response) {
      console.log('authreq',req.auth)
      if ( !req.auth) return res.sendStatus(401);
      res.sendStatus(200);
    }
  );

 

