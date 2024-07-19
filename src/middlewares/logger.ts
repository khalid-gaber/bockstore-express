import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, `${req.protocol}://${req.headers.host}${req.url}`);
    next();
}

module.exports = logger;