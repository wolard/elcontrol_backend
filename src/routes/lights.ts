import { Router } from "express";
import { writereg } from "../modbushandles/modbushandle";
import { io} from "..";
import { ILight } from "../@types";

export interface IoutletData {
card:number
relay:number
type:string

}
const lightRouter = Router();

lightRouter.post("/light",  async (req, res, next) => {
     console.log('command',req.body);
    const command = req.body as ILight;
    command.status=!command.status
    io.emit("light",command)
    const status=await writereg(command)
    console.log('status',status)
      res.sendStatus(200);
    
   
  
  });
  export default lightRouter