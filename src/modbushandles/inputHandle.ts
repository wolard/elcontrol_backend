import ModbusRTU from "modbus-serial";
import { IoutletData } from "../routes/lights";
const client = new ModbusRTU();
const  connect = async () =>
{
 await client.connectRTUBuffered("/dev/ttySC0", {baudRate: 9600})
 client.setID(1);
 client.setTimeout(100);

}
export const  writereg =async (outlet:IoutletData):Promise<boolean>=> {
    console.log('outlet',outlet);
 
        try
        {
        await connect();
        if (( outlet.relay<0)&&( outlet.relay>17)) {
         
            await client.writeRegister(outlet.relay, 1280)
            return true
            }
        }
            catch(e)
            {
                client.close(()=>console.log("closed"));
               // console.log(e)
                return false
            }
            return false
       
}
