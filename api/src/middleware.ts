import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthanticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.status(403).json({ message: "not logged in" })
            return
        }
        const payload = jwt.verify(token, "sssss")
        // @ts-ignore
        req.id = payload.id
        next()


    } catch (error) {
        res.status(403).json({ message: "not logged in" })
    }

}