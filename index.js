var express = require("express");
var cors = require('cors')
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var app = express();
app.use(cors());
app.use(express.json());
var fs = require('fs');

let configjson;


configjson=fs.readFileSync('config.json').toString();
console.log(configjson);
const ConfObj=JSON.parse(configjson);

const modbushandler =(command) => {
client.writefc6(command.card,command.relay,1280);

}
//client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });

//const ledoff = () =>client.writeFC6(1,5,512);
//const ledon = () =>client.writeFC6(1,5,256);
app.post("/light", (req, res, next) => {
   console.log(req.body);
   let command=req.body;
modbushandler(command);

   res.sendStatus(200);
    
 });
app.get("/init", (req, res, next) => {
 // console.log(req.body);
  res.send(ConfObj)
   
});
app.get("/ledon", (req, res, next) => {
  //  ledon();
    res.json({"ledi":"päällä"});
   });
   app.get("/ledoff", (req, res, next) => {
   // ledoff();
    res.json({"ledi":"pois"});
   });
app.listen(3000, () => {
 console.log("Server running on port 3000");
});