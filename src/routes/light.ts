import { Router } from "express";
import { writereg } from "../modbushandle/modbushandle";
import { io } from "..";


const lightRouter = Router();

lightRouter.post("/light",  async (req, res, next) => {
    // console.log(req.body);
    let command = req.body.val;
    await writereg(command)
   
      io.emit('switchquery', command.relay);
      res.sendStatus(200);
    
   
  
  });
  export default lightRouter