const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
const sqLiteHandler = require('./sqlitehandler/sqlitehandler')
const statemap =require('./statemap/statemap')
app.use(cors());
app.use(express.json());
var client = new ModbusRTU();
client.connectRTUBuffered("/dev/serial0", {
  baudRate: 9600
});

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;
statemap.forEach((item) => {
  gpio.setup(item.gpio, gpio.DIR_IN, gpio.EDGE_BOTH); //initialize gpio according to statemap

})


let r //data from database
let sql = "SELECT * FROM elcontrol"
let loadd = new sqLiteHandler('./db/elcontrol.db');
(async () => {                  //load buttons from database
  try {

    await loadd.openSqlite();
    r = await loadd.fetchall(sql, [])
    await loadd.close()
    console.log(r);
  } catch (e) {
    console.log(e);
  }


})();




var timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 400);

let sequenceNumberByClient = new Map();


io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  gpio.on('change', function (channel, value) {


    clearTimeout(timeoutObj);
    timeoutObj = setTimeout(() => {
      let relay = statemap.find(rel => rel.gpio == channel)
      console.log(relay.relay + ' ' + value);
      socket.emit('my broadcast', {
        relay: relay.relay,
        status: value
      });
    }, 400);



  });
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});



const modbushandler = (command) => {

  client.writeFC6(command.card, command.relay, 1280);

}
app.post('/signin', (req, res) => {
  // ...

  const token = generateAccessToken({ username: req.body.username });
  res.json(token);

  // ...
});
const  generateAccessToken= (username)=> {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

app.post("/light", (req, res, next) => {
  // console.log(req.body);
  let command = req.body;
  modbushandler(command);
  res.sendStatus(200);

});
app.get("/init", (req, res, next) => {
  // console.log(req.body);
  res.send(r)

});

  