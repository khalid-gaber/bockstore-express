import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');

declare module 'express' {
    export interface Request {
      user?: {
        _id: string,
        username: string,
        iat: number
      };
      decoded?: {
        userId: string
      } 
    }
  }

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization?.split('Bearer ')[1];
    console.log(accessToken);
    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY);
    if(decoded) {
        req.decoded = decoded;
        next();
    } else {
        res.sendStatus(403);
    }
  } catch (error: any) {
    res.sendStatus(403);
  }

}





///////export///////////
module.exports = {
  authenticateToken
};


