import express from "express"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const db = new PrismaClient();

const app = express();
app.use(express.json());



const isAuthanticated = async (req: Request, res: Response, next: NextFunction) => {
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


app.post("/hook/:zapId", isAuthanticated, async (req: Request, res: Response) => {
    try {

        const { zapId } = req.params;
        const body = req.body;
        await db.$transaction(async (tx) => {
            const zapRun = await tx.zapRun.create({
                data: {
                    zapId,
                    metadata: body
                }
            })
            await tx.zapRunOutBox.create({
                data: {
                    zapRunId: zapRun.id,
                }
            })
        })

        res.status(200).json({ message: "zap run created" })
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }

})







app.listen(8800, () => {
    console.log("server is running on port 8800")
});




