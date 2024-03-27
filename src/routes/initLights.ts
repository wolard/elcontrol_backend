import { Router,} from "express";
import { Elcontrol } from "../models/models";
import cors from "cors";
import { where } from "sequelize";
import express  from 'express';
import { expressjwt, Request as JWTRequest } from "express-jwt";

const initLightsRouter = Router();
let corsOptions = { 
    origin: [ 'http://localhost:5500', 'http://localhost:3000' ] 
  }; 
initLightsRouter.get(
  "/initlights",
   /*  expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] })  ,*/
 async function (req:JWTRequest, res: express.Response) {
  console.log('authreq',req.auth)
  const lights=await Elcontrol.findAll({where:{groupname:'valot'}})
 // console.log('lights',lights)
  //let lights=await Elcontrol.findAll()
  // Post.findAll({
  //   where: {
  //     authorId: 2
  //   }
  // });


// lights.forEach(l=>l.status=false)
 res.status(200).send(lights)



    //await Db.dbInit();

   
     
  
    });
    export default initLightsRouter