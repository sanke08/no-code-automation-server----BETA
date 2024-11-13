import { Request, Response, } from "express";
import { db } from "../db";


export const getAction = async (req: Request, res: Response) => {
    try {

        const actions = await db.action.findMany({})
        res.json({ actions })
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}       