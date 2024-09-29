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
    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY);
    if(decoded) {
        req.decoded = decoded;
        next();
    } else {
        res.sendStatus(403);
    }
  } catch (error: any) {
    console.log(error.message || 'something went wrong');
    res.sendStatus(403);
  }
}

function decodeTokenIfAny(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization?.split('Bearer ')[1];
    if(accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY);
      if(decoded) {
          req.decoded = decoded;
          next();
      } else {
        res.sendStatus(403);
      }
    } else {
      next();
    }
  } catch (error: any) {
    console.log(error.message);
    next();
  }
}



///////export///////////
module.exports = {
  authenticateToken,
  decodeTokenIfAny
};


