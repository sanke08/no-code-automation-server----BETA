import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";



export const db = new PrismaClient()




export const kafka = new Kafka({
    clientId: 'processor',
    brokers: ["localhost:9092"],
})


