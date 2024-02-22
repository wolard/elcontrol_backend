import ModbusRTU from "modbus-serial";
const client = new ModbusRTU();
const  connect = async () =>
{
 await client.connectRTUBuffered("/dev/ttySC0", {baudRate: 9600})
 client.setID(1);
 client.setTimeout(100);

}
export const  writereg =async (reg:number):Promise<boolean>=> {
    console.log('reg',reg);
 
        try
        {
        await connect();
        if (( reg<0)&&( reg>17)) {
         
            await client.writeRegister(reg, 1280)
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
