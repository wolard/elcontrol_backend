import { Router } from "express";
import { writereg } from "../modbushandles/modbushandle";
import { client, io} from "..";
import { IOutlet } from "../@types";

const outletRouter = Router();

outletRouter.post("/outlet",  async (req, res, next) => {
    // console.log('body',req.body);
    let outlet = req.body as IOutlet;
 // const status=  await writereg(command)
 const status=await writereg(outlet)
 if(typeof status!=="undefined")
 {
 outlet.status=status
  
   
console.log('sending status',outlet)
      res.send(outlet);
      io.emit('outlet',outlet)
  }
  else res.status(500).send('failed to switch')
}
  
  
  );

  export default outletRouter