import ModbusRTU from "modbus-serial";
import { IoutletData } from "../routes/lights";
import { client } from "..";

async function mb(outlet:IoutletData,times:number):Promise<boolean>{
  console.log('trying',times)
  
  
  try{
    client.setID(2)
   const command=await client.writeRegister(outlet.relay, 1280)
   if(command.address===outlet.relay)
   {
    await delay(1000);
    client.setID(10)
    const res= await client.readDiscreteInputs(0,16)
    return res.data[command.address-1]
   }
   return false
  }
  catch(e:any)
  {
    console.log('error on switch',e.message)
    if(times>0)
    {
      if(!client.isOpen)
      {
        await client.connectRTUBuffered("/dev/ttyAMA2", { baudRate: 9600 });
       
      }
      console.log('times',times)
      await delay(100);
     times= times-1
      return await mb(outlet,times)

    }
  }
return false
}
export async function readOutputs(times:number):Promise<boolean[]|undefined>{
  console.log('trying',times)
  
  
  try{
 

    client.setID(10)
    const res= await client.readDiscreteInputs(0,16)
    return res.data
   
  }
  catch(e:any)
  {
    console.log('error on reading inputs',e.message)
    if(times>0)
    {
      if(!client.isOpen)
      {
        await client.connectRTUBuffered("/dev/ttyAMA2", { baudRate: 9600 });
       
      }
      console.log('times',times)
      await delay(100);
     times= times-1
      return await readOutputs(times)

    }
  }
return undefined
}
export function delay(time:number) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

export const  writereg =async (outlet:IoutletData):Promise<boolean|undefined>=> {
        try
        {
        if (( outlet.relay>0)&&( outlet.relay<17)) {
       return   await mb(outlet,10)
        }
        
           
       }
            catch(e)
            { 
              console.log('failed')
           
        return  false
          
          
             
            
            
            }
            console.log('after')
            return undefined

}

