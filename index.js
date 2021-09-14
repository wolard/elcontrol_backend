const jwt = require('jsonwebtoken');
const auth =require('./middleware/auth')
const bcrypt = require('bcrypt')
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
const statemap =require('./statemap/statemap');
const { Hash } = require('crypto');
app.use(cors());
app.use(express.json());
var client = new ModbusRTU();
client.connectRTUBuffered("/dev/serial0", {
  baudRate: 9600
});

// get config vars
//config();

// access config var
process.env.TOKEN_SECRET;
statemap.forEach((item) => {
  gpio.setup(item.gpio, gpio.DIR_IN, gpio.EDGE_BOTH); //initialize gpio according to statemap

})


let r //data from database

let loadd = new sqLiteHandler('./db/elcontrol.db');


function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10)
 return  bcrypt.hashSync(password, salt)
 
}
let hashpw=hashPassword('kopo2008');
console.log('hashpw',hashpw)
var timeoutObj = setTimeout(() => {
  console.log('timeout beyond time');
}, 400);

let sequenceNumberByClient = new Map();


io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  io.on('change', function (channel, value) {


    clearTimeout(timeoutObj);
    timeoutObj = setTimeout(() => {
      let relay = find(rel => rel.gpio == channel)
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
  return sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

app.post("/light", (req, res, next) => {
  // console.log(req.body);
  let command = req.body;
  modbushandler(command);
  res.sendStatus(200);

});
app.get("/init", async (req, res, next) => {
  try {

    await loadd.openSqlite();
    let sql = "SELECT * FROM elcontrol"
    r = await loadd.fetchall(sql, [])
    await loadd.close()
    res.send(r)
  } catch (e) {
    console.log(e);
  }
 

});

app.post("/login", async (req, res, next) => {
  try {
   
    const { user, password } = req.body;
    let name=null;
    let hash=null;
    
    
  
    if (!(user && password)) {
      res.status(400).send("All input is required");
    }
   
    // Validate if user exist in our database
    //const user = await User.findOne({ email });
    
      await loadd.openSqlite();
      let sql = "SELECT * FROM auth where name=?"
      r = await loadd.fetchall(sql, [user])
      console.log(r);
     if(r[0]){
      console.log(r);
      name=r[0].name;
      hash=r[0].hash;
     }
     else{
       name=null;
       hash=null;
     }
     

  
   
      await loadd.close()
     
     
      
      if (name && (await bcrypt.compare(password, hash))) {
     //if(user){ 
     // Create token
      const token = jwt.sign(
        { user_id: 'wolard' },
      //  process.env.TOKEN_KEY,
      'dinfwicbnweiocnoweic',  
      {
          expiresIn: "2h",
        }
      );

      // save user token
    
 
      // user
      res.status(200).send({user:'wolard',token:token});
    }
   else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});