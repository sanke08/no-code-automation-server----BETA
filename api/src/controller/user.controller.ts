import { Request, RequestHandler, Response } from "express"
import { SigninSchema, SignupSchema } from "../utils/validators";
import { db } from "../db";
import jwt from "jsonwebtoken";

export const signUp: RequestHandler = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body);

        if (!parsedData.success) {
            res.status(411).json({ message: "Incorrect inputs" })
            return
        }

        const userExists = await db.user.findFirst({
            where: {
                email: parsedData.data.username
            }
        });

        if (userExists) {
            res.status(403).json({
                message: "User already exists"
            })
            return
        }

        await db.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })

        res.json({ message: "Please verify your account by checking your email" });


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


export const signIn = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body);

        if (!parsedData.success) {
            res.status(411).json({ message: "Incorrect inputs" })
            return
        }
        const user = await db.user.findFirst({
            where: {
                email: parsedData.data.username,
                password: parsedData.data.password
            }
        });

        if (!user) {
            res.status(403).json({
                message: "Sorry credentials are incorrect"
            })
            return
        }

        // sign the jwt
        const token = jwt.sign({
            id: user.id
        }, "sssss");

        res.json({ token });


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


export const getUser = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const id = req.id;
        const user = await db.user.findFirst({
            where: {
                id
            },
            select: {
                name: true,
                email: true
            }
        });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
