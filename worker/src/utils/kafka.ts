import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: 'outbox-worker',
    brokers: ["localhost:9092"],
})


