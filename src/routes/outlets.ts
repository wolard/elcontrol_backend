import { Router } from "express";
import { delay, writereg } from "../modbushandles/modbushandle";
import { client, io} from "..";
import { IOutlet } from "../@types";
import { queue } from "../queue/queue";

const outletRouter = Router();

outletRouter.post("/outlet",  async (req, res, next) => {
    // console.log('body',req.body);
    let outlet = req.body as IOutlet;
 // const status=  await writereg(command)
await queue.push({args:outlet,actionType:'writeReg'}).catch((err) => console.error(err))
 res.sendStatus(200)
}
  
  
  );

  export default outletRouter