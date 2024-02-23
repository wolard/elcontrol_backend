import { Router } from "express";
import { Elcontrol } from "../models/models";

const initRouter = Router();

initRouter.get("/init", async (req, res, next) => {


    //await Db.dbInit();
    let lights=await Elcontrol.findAll()
   // lights.forEach(l=>l.status=false)
    res.status(200).send(lights)
   
     
  
    });
    export default initRouter