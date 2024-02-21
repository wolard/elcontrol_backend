import { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
export const verifyToken = (req:Request, res:Response, next:NextFunction):any => {
  const token =
  req.headers["x-access-token"] as string;
  //console.log('headers', req.headers["x-access-token"])

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token,'dinfwicbnweiocnoweic');
   
   //req. .user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
