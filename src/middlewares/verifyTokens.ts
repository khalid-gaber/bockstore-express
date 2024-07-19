import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');

declare module 'express' {
    export interface Request {
      user?: {
        _id: string,
        username: string,
        iat: number
      };
    }
  }

const decodeToken = (req: Request, res: Response, next: NextFunction)=>{
  try {
      const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY);
      req.user = decoded;
      next();
  } catch(err: any) {
      res.status(400).json({message: err.message});
  }
}

const decodeTokenIfAny = async (req: Request, res: Response, next: NextFunction)=>{
  try{
    if(req.headers.token){
      const decoded = await jwt.verify(req.headers.token, process.env.JWT_KEY);
      req.user = decoded;  
    }
    next();
  } catch(err: any) {
    next();
  }
}

module.exports = {
  decodeToken,
  decodeTokenIfAny
};