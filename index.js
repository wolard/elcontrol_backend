//const modbus = require('modbus')
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
  },
});
 
server.listen(3000);
const cors = require('cors')
const ModbusRTU = require("modbus-serial");
//const gpio = require('rpi-gpio');
const sqlite3 = require('sqlite3').verbose();
const sqLiteHandler = require('./sqlitehandler/sqlitehandler')
const statemap = require('./statemap/statemap');
const {
  Hash
} = require('crypto');
app.use(cors());
app.use(express.json());
var client = new ModbusRTU();

const  connect = async () =>
{
 await client.connectRTUBuffered("/dev/ttySC0", {baudRate: 9600})
 client.setID(1);
 client.setTimeout(100);

}


// get config vars
//config();

// access config var
process.env.TOKEN_SECRET;
/*
statemap.forEach((item) => {
  gpio.setup(item.gpio, gpio.DIR_IN, gpio.EDGE_BOTH); //initialize gpio according to statemap

})
*/
//gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH);

let dbuser //data from database

let loadd = new sqLiteHandler('./db/elcontrol.db');


function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)

}
let hashpw = hashPassword('kopo2008');
console.log('hashpw', hashpw)
var timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 400);

let sequenceNumberByClient = new Map();


io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);
/*
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



  });^
  */
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});



const modbushandler  =  async (command) => {
  //const python = spawn('python3', ['modbushandle.py', command.relay]);
  await connect();
  await client.writeRegister (command.relay, 1280)
  .catch(function(e) {
      console.log(e.message); })
      client.close(console.log("closed"));
 
}

app.post("/light", auth, (req, res, next) => {
  // console.log(req.body);
  let command = req.body;
  modbushandler(command);
  res.sendStatus(200);

});
app.get("/init", auth, async (req, res, next) => {
  try {

    await loadd.openSqlite();
    let sql = "SELECT * FROM elcontrol"
    let lights = await loadd.fetchall(sql, [])
    await loadd.close()
    res.status(200).send(lights)
  } catch (e) {
    console.log(e);
  }


});

app.post("/login", async (req, res, next) => {
  try {

    const {
      user,
      password
    } = req.body;

    if (!(user && password)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    //const user = await User.findOne({ email });

    await loadd.openSqlite();
    let sql = "SELECT * FROM auth where name=?"
    const dbuser = await loadd.fetchone(sql, [user])

    console.log(dbuser);

    await loadd.close()



    if (dbuser && (await bcrypt.compare(password, dbuser.hash))) {
      //if(user){ 
      // Create token
      const token = jwt.sign({
          user: dbuser.name
        },
        //  process.env.TOKEN_KEY,
        'dinfwicbnweiocnoweic', {
          expiresIn: "2h",
        }
      );

      // save user token
      dbuser.token = token;
      console.log(dbuser);

      // user
      res.status(200).send({
        user: 'wolard',
        token: token
      });
    } else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

