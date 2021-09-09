const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
http.listen(3000);





const cors = require('cors')
const ModbusRTU = require("modbus-serial");
const gpio = require('rpi-gpio');
const sqlite3 = require('sqlite3').verbose();
const sqLiteHandler =require('./sqlitehandler/sqlitehandler')

let r
let sql = "SELECT * FROM elcontrol"

let loadd=new sqLiteHandler('./db/elcontrol.db');




(async ()=> {
   
try
{

    await loadd.openSqlite();
    r=await loadd.fetchall(sql, [])
    await loadd.close();
  console.log(r);
} catch(e) {
    console.log(e);
}

  
})();




// open database in memory


app.use(cors());
app.use(express.json());




let statemap=[{'gpio':11, 'relay':1},   //gpios mapped to actual relays
              {'gpio':12, 'relay':2},
              {'gpio':13, 'relay':3},
              {'gpio':15, 'relay':4},
              {'gpio':16, 'relay':5},
              {'gpio':18, 'relay':6},
              {'gpio':19, 'relay':7},
              {'gpio':21, 'relay':8},
              {'gpio':23, 'relay':9},
              {'gpio':32, 'relay':10},
              {'gpio':33, 'relay':11},
              {'gpio':35, 'relay':12},
              {'gpio':36, 'relay':13},
              {'gpio':37, 'relay':14},
              {'gpio':38, 'relay':15},
              {'gpio':40, 'relay':16},

]

statemap.forEach((item)=>{
  gpio.setup(item.gpio, gpio.DIR_IN, gpio.EDGE_BOTH);

})
//gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH);
           









var fs = require('fs');

let configjson;
var client = new ModbusRTU();
client.connectRTUBuffered("/dev/serial0", { baudRate: 9600 });



var timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 200);

let sequenceNumberByClient = new Map();


io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);
  gpio.on('change', function(channel, value) {


    clearTimeout(timeoutObj);
    timeoutObj = setTimeout(() => {
    let relay=statemap.find(rel => rel.gpio == channel)
  
    console.log(relay.relay+' '+value);
     socket.emit('my broadcast',{relay:relay.relay,status:value});
    }, 200);
  
     
    
    });
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
      sequenceNumberByClient.delete(socket);
      console.info(`Client gone [id=${socket.id}]`);
  });
});









configjson=fs.readFileSync('config.json').toString();
//console.log(configjson);
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
  
  
   // arrlightstate[command.relay]=(!arrlightstate[command.relay]);
   // console.log(arrlightstate[command.relay])
    //res.send (arrlightstate[command.relay]);
    res.sendStatus(200);
   // res.json('{'+command.relay +':' +arrlightstate[command.relay] +'}')
    
//


  
    
 });
app.get("/init", (req, res, next) => {
 // console.log(req.body);
  res.send(r)
   
});
app.get("/ledon", (req, res, next) => {
  //  ledon();
    res.json({"ledi":"päällä"});
   });
   app.get("/ledoff", (req, res, next) => {
   // ledoff();
    res.json({"ledi":"pois"});
   });
  