const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors')
const ModbusRTU = require("modbus-serial");
var gpio = require('rpi-gpio');
var val;
var oldval;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

server.listen(8888);

//var client = new ModbusRTU();
//const app = express();
app.use(cors());
app.use(express.json());
var fs = require('fs');
//client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });
let configjson;
var client = new ModbusRTU();
client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });
let interval;

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("sdiofjsdiofj");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
 
    });
  });

};
var timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 200);

gpio.setup(16, gpio.DIR_IN, gpio.EDGE_FALLING);
gpio.on('change', function(channel, value) {


	clearTimeout(timeoutObj);
  timeoutObj = setTimeout(() => {
    io.emit("FromAPI", value);
  }, 200);

   
  
  });

//});


configjson=fs.readFileSync('config.json').toString();
console.log(configjson);
const ConfObj=JSON.parse(configjson);

const modbushandler =(command) => {

client.writeFC6(command.card,command.relay,1280);

}
//client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });

//const ledoff = () =>client.writeFC6(1,5,512);

app.post("/light", (req, res, next) => {
  // console.log(req.body);
   let command=req.body;
   modbushandler(command);
  
    res.sendStatus(200);
//


  
    
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