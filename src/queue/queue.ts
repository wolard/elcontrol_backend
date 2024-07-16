import fastq, { queueAsPromised } from "fastq"
import { client, io, outlets } from ".."
import { IOutlet } from "../@types"
import { delay } from "../modbushandles/modbushandle"
import { ReadRegisterResult } from "modbus-serial/ModbusRTU"
type Task = {
    args: any,
    actionType:'writeReg'|'emitWatts'|'readWatts'|'readStatus'
  }
let kwhs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

let kwh:ReadRegisterResult
export const queue: queueAsPromised<Task> = fastq.promise(worker, 1)

async function worker ({args,actionType}:Task) {
const outlet1ConsumptionReg=210
  switch (actionType){
  case 'writeReg':
    const outlet=args as IOutlet
    client.setID(2)
    const command=await client.writeRegister(outlet!.relay, 1280)
     if(command.address===outlet!.relay)
    {
    
     client.setID(10)
     await delay(600)
     const res= await client.readDiscreteInputs(0,16)
     const idx = outlets.findIndex(out =>out.relay  === outlet.relay);
     outlets[idx].status=res.data[command.address-1]
        io.emit('outlet', outlets[idx])
   
    }
  

case 'emitWatts':
 
 client.setID(1)
kwh= await client.readHoldingRegisters(outlet1ConsumptionReg,2)
  if(kwhs[0]!==kwh.data[1])
  {
   
 kwhs[0]=kwh.data[1]
    io.emit('watts',1,kwh.data[1])
  }
    case 'readWatts':
        client.setID(1)
        kwh= await client.readHoldingRegisters(outlet1ConsumptionReg,2)
         console.log('counter',kwh)  
        kwhs[0]=kwh.data[1]
        io.emit('watts',1,kwh.data[1])
         
  case 'readStatus':
    if(client.isOpen && outlets)
    {
    client.setID(10)
    const statuses=await client.readDiscreteInputs(0, 16)
    outlets.forEach(out=>{
        if(out.status!==statuses.data[out.relay-1])
{

    console.log('changed')
}

    })
    }
  }
  

}
async function pollPresses(){
  console.log('polling external presses')
  await queue.push({ args: undefined, actionType: 'readStatus' })
 setTimeout(() => { 
  pollPresses()
 
 },2000 ); 


}
function startPollPresses(){
setTimeout(()=>{
  pollPresses()

},2000)
}
startPollPresses()
setInterval(async () => await queue.push({ args: undefined, actionType: 'emitWatts' }), 10000);

