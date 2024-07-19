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

const decodeTokenIfAny = (req: Request, res: Response, next: NextFunction)=>{
  try{
    const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY);
    req.user = decoded || null;
    next();
  } catch(err: any) {
    next();
  }
}

module.exports = {
  decodeToken,
  decodeTokenIfAny
};