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
const statemap = require('./statemap/statemap');
const modbushandle = require('./modbushandle/modbushandle');
const {
  Hash
} = require('crypto');
app.use(cors());
app.use(express.json());
const Db = require('./db/db');
const { timeStamp } = require('console');
const {
  Op
} = require('sequelize');
const { json } = require('body-parser');

//const Op = db.Sequelize.Op;
let oldDate=new Date('2014-04-03');
let newDate=new Date();
process.env.TOKEN_SECRET;
let db={};
(async () => {
  db = await Db.dbInit();
  const awesomeKlaus = await db.users.findOne({
    where: {
        firstname: 'klaus'
    },
    include: db.cars
});
  //const json=JSON.stringify(awesomeKlaus);
  awesomeKlaus.Cars.forEach(car => console.log(car.make, car.model))
  //carres.forEach(car=> console.log(car))
  //const res=JSON.parse(json)
  // res.Cars.forEach(car => {console.log(car.model)})
  //console.log(res[0].Cars[0].model);
})()

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
    
    //socket.join('pulses')
  // initialize this client's sequence number
    sequenceNumberByClient.set(socket, 1);
   
 
 socket.on('ioboard',async (data) => {
    const { switchstate } = data;
    try {
    const device = await db.elControls.findOne({ where: { relay: switchstate.num } });
    console.log(device)
    io.emit('ioboard', switchstate);
    }
    catch(err)
    {
      console.log(err);
    }
 });
    socket.on('pulses',async (data) => {
      const { pulses } = data;
    //  console.log(data.pulses);
  
 
   
    for (let i = 0; i < pulses.pulses.length; i++) {
      if (pulses.pulses[i]>0) {
      const outlet = await db.kwhs.findOne({ 
      
        where: {
          elcontrolrelay:i+1,
          createdAt: {
            [Op.gt]: (new Date() - 60* 60 * 1000)
          }
        }
       });
   // console.log('outlet',outlet);
     //todo write a logic that separates outlets
      if (outlet===null)
      {
        console.log('creating new cell')
        try
        {
        const cell=await db.kwhs.create({'elcontrolrelay':i+1,'pulses':pulses.pulses[i]})
        }
        catch(e)
        {
          console.log(e)
        }
      
      
      }
   
      else
      {
        console.log('updating hour cell');
        //console.log(outlet);
       
        
        await outlet.update({'pulses':outlet.pulses+pulses.pulses[i]});
       const kwhs = await outlet.save();
      //  console.log(JSON.stringify(kwhs))
      }
      }
  }
   }
 
);

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
 if (!(Object.entries(db).length === 0)) {
   console.log(db)
  //await Db.dbInit();
  let lights=await db.elControls.findAll()
  res.status(200).send(lights)
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
    
    const dbuser = await  db.authorizes.findOne({ where: { name: user } });
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

