const ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
const  connect = async () =>
{
 await client.connectRTUBuffered("/dev/ttySC0", {baudRate: 9600})
 client.setID(1);
 client.setTimeout(100);

}
module.exports = async function writereg(...args) {
    console.log(args);
    for (i = 0; i < args.length; i++) {

        await connect();
        if (0 < args[i] < 17) {
            await client.writeRegister(args[i], 1280)
                .catch(function (e) {
                    console.log(e.message);
                });
            client.close(console.log("closed"));
        }
    }

}