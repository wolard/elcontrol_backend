var express = require("express");
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var app = express();
var fs = require('fs');
let configjson;
configjson=fs.readFileSync('config.json').toString();
console.log(configjson);
let ConfObj=JSON.parse(configjson);
//client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });

//const ledoff = () =>client.writeFC6(1,5,512);
//const ledon = () =>client.writeFC6(1,5,256);
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