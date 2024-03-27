import { Router,} from "express";
import { Elcontrol } from "../models/models";
import cors from "cors";
import { where } from "sequelize";
import express  from 'express';
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { readwatts } from "..";
import { readOutputs } from "../modbushandles/modbushandle";

const initOutletsRouter = Router();
let corsOptions = { 
    origin: [ 'http://localhost:5500', 'http://localhost:3000' ] 
  }; 
initOutletsRouter.get(
  "/initoutlets",
    expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] })  ,
 async function (req:JWTRequest, res: express.Response) {
  console.log('authreq',req.auth)

  const outlets=await Elcontrol.findAll({where:{groupname:'pistorasiat'}})
 const statuses=await readOutputs(10)
 outlets.forEach(out=>{out.status=statuses![out.relay] })
 console.log('outlets',outlets)
 res.status(200).send(outlets)



    //await Db.dbInit();

   
     
  
    });
    export default initOutletsRouter