import { Router,} from "express";
import express  from 'express';
import { expressjwt, Request as JWTRequest } from "express-jwt";

import { outlets} from "..";
import { queue } from "../queue/queue";

const initOutletsRouter = Router();
let corsOptions = { 
    origin: [ 'http://localhost:5500', 'http://localhost:3000' ] 
  }; 
initOutletsRouter.get(
  "/initoutlets",
    expressjwt({ secret: "dinfwicbnweiocnoweic", algorithms: ["HS256"] })  ,
 async function (req:JWTRequest, res: express.Response) {
  console.log('authreq',req.auth)
  await queue.push({args:undefined,actionType:'readWatts'})

  //const outlets=await Elcontrol.findAll({where:{groupname:'pistorasiat'}})

 //outlets.forEach(out=>{out.status=statuses![out.relay] })
 //console.log('outlets',outlets)
 res.status(200).send(outlets)



    //await Db.dbInit();

   
     
  
    });
    export default initOutletsRouter