import { Sequelize } from 'sequelize-typescript';
import {seedDb} from './db/db';
import { dbConf } from './db/dbconf';
import { Authorize, Elcontrol, Users } from './models/models';
import jwt from 'jsonwebtoken';
//const auth = require('./middleware/auth')
//import auth from './middleware/auth'
//const bcrypt = require('bcrypt')
import { expressjwt, Request as JWTRequest } from "express-jwt";
import bcrypt from 'bcrypt'
const dotenv = require('dotenv');
//const express = require('express');
import express  from 'express';

import cors from 'cors'
const app = express();
app.use(cors());
app.use(express.json());
//const http = require('http');
import http from 'http';
const server = http.createServer(app);
import{Server} from 'socket.io'
//const { Server } = require("socket.io");
//const io = socketIo(server);
const io = new Server(server,{
  cors: {
    origin: "*",
  },
});
 
server.listen(1111, () => {
  console.log(`Server is running on port ${1111}`);
});
console.log('star');
const sequelize = new Sequelize(dbConf);
(async () => {

  await sequelize.sync({force: true});
  await seedDb()
 // const usr= await Users.findAll()
 // console.log('usr',usr)

})();
app.post("/login", async (req, res, next) => {
  console.log('req',req.body)
   try {

    const {
      user,
      password
    } = req.body; 

    if (!(user && password)) {
      res.status(400).send("All input is required");
    }
    
    let dbuser = await  Authorize.findOne({ where: { username: user } });
    console.log('user',dbuser);
    
   



    if (dbuser && (await bcrypt.compare(password, dbuser.hash))) {
      //if(user){ 
      // Create token
      const token = jwt.sign({
          user: dbuser.username,
          role:dbuser.role
        },
        //  process.env.TOKEN_KEY,
        'dinfwicbnweiocnoweic', {
          expiresIn: "2h",
          
        }
      );

      
      console.log('token',token);

      // user
      res.status(200).send({
        user: dbuser.username,
        token: token
      });
    } else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.get("/init", async (req, res, next) => {


   //await Db.dbInit();
   let lights=await Elcontrol.findAll()
  // lights.forEach(l=>l.status=false)
   res.status(200).send(lights)
  
    
 
   });
   app.get(
    "/protected",
    expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] }),
    function (req: JWTRequest, res: express.Response) {
      console.log('authreq',req.auth)
      if ( !req.auth) return res.sendStatus(401);
      res.sendStatus(200);
    }
  );
