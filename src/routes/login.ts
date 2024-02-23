import { Router } from "express";
import bcrypt from 'bcrypt'
import { Authorize } from "../models/models";
import jwt from 'jsonwebtoken';

const loginRouter = Router();

loginRouter.post("/login", async (req, res, next) => {
    console.log('req',req.body)
     try {
  
      const {
        user,
        password
      } = req.body; 
  
      if (!(user && password)) {
        res.status(400).send("All input is required");
      }
      
      let dbuser = await  Authorize.findOne({ where: { username: user } });
      console.log('user',dbuser);
      
     
  
  
  
      if (dbuser && (await bcrypt.compare(password, dbuser.hash))) {
        //if(user){ 
        // Create token
        const token = jwt.sign({
            user: dbuser.username,
            role:dbuser.role
          },
          //  process.env.TOKEN_KEY,
          'dinfwicbnweiocnoweic', {
            expiresIn: "2h",
            
          }
        );
  
        
        console.log('token',token);
  
        // user
        res.status(200).send({
          user: dbuser.username,
          token: token
        });
      } else res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  export default loginRouter
 