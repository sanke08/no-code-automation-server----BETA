import { Request, Response } from "express";
import { ZapCreateSchema } from "../utils/validators";
import { db } from "../db";

export const createZap = async (req: Request, res: Response) => {
    try {

        // @ts-ignore
        const userId: string = req.id;
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);

        if (!parsedData.success) {
            res.status(411).json({
                message: "Incorrect inputs"
            });
            return 
        }

        const zapId = await db.$transaction(async (tx) => {


            const trigger = await tx.trigger.create({
                data: {
                    triggerId: parsedData.data.availableTriggerId
                }
            })


            const zap = await tx.zap.create({
                data: {
                    userId,
                    triggerId: trigger.id,
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metaData: x.actionMetadata
                        }))
                    }
                }
            })

            return zap.id


        })

        res.status(200).json({ zapId })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }

}

export const getZaps = async (req: Request, res: Response) => {
    try {

        // @ts-ignore
        const userId = req.id

        const zaps = await db.zap.findMany({
            where: {
                userId
            },
            include: {
                actions: {
                    include: {
                        type: true
                    }
                },
                trigger: {
                    include: {
                        type: true
                    }
                }
            }
        })

        res.json({ zaps })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getZapById = async (req: Request, res: Response) => {

    try {
        // @ts-ignore
        const userId = req.id
        const zapId = req.params.zapId

        const zap = await db.zap.findUnique({
            where: {
                id: zapId,
                userId
            },
            include: {
                actions: {
                   include: {
                        type: true
                   }
                },
                trigger: {
                    include: {
                        type: true
                    }
                }
            }
        })

        res.json({ zap })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

