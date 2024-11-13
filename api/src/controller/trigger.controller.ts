import { Request, Response, } from "express";
import { db } from "../db";


export const getTrigger = async (req: Request, res: Response) => {
    try {

        const triggers = await db.trigger.findMany({})
        res.json({ triggers })
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
