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
const sqLiteHandler = require('./sqlitehandler/sqlitehandler')
const statemap = require('./statemap/statemap');
const modbushandle = require('./modbushandle/modbushandle');
const {
  Hash
} = require('crypto');
app.use(cors());
app.use(express.json());
const db = require("./models/index.js");
const authorize = db.authorize;
const elcontrol=db.elcontrol;

const Op = db.Sequelize.Op;

process.env.TOKEN_SECRET;


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


io.on("connection",async (socket) =>  {
  console.info(`Client connected [id=${socket.id}]`);
  socket.join('chat')
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);
  socket.on('python message', (msg) => {
    console.log('message: ' + msg);
  });
  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
 });
 socket.on('chat',async (data) => {
  const { message, room } = data;
  console.log(`msg: ${message}, room: ${room}`);

  console.log(message.pulses)
  for (var i = 0; i < message.pulses.length; i++) {
    const outlet = await elcontrol.findOne({ where: { id: (i+1) } });
await outlet.update({kwh:message.pulses[i]});
await outlet.save();
    console.log(outlet);
  }
    let sql = 'UPDATE elcontrol SET kwh = ? where id=?';
   // loadd.update(sql, [message.pulses[0],1])
  //loadd.closesync()
  
  io.to(room).emit('chat', message);
  console.log(message);
});

  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
});





app.post("/light", auth, async  (req, res, next) => {
  // console.log(req.body);
  let command = req.body;
  await modbushandle(command.relay);
  res.sendStatus(200);

});
app.get("/init", auth, async (req, res, next) => {
  let lights=await elcontrol.findAll()
  res.status(200).send(lights)
   
   

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
    
    const dbuser = await authorize.findOne({ where: { name: user } });
    console.log('user',dbuser);
    
   



    if (dbuser && (await bcrypt.compare(password, dbuser.hash))) {
      //if(user){ 
      // Create token
      const token = jwt.sign({
          user: dbuser.name,
          role:dbuser.role
        },
        //  process.env.TOKEN_KEY,
        'dinfwicbnweiocnoweic', {
          expiresIn: "2h",
          
        }
      );

      // save user token
      dbuser.token = token;
     // console.log(dbuser);

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

