"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const db = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    brokers: [process.env.UPSTASH_KAFKA_REST_URL],
    ssl: true,
    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.UPSTASH_KAFKA_REST_USERNAME,
        password: process.env.UPSTASH_KAFKA_REST_PASSWORD,
    },
    logLevel: kafkajs_1.logLevel.ERROR
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const producer = kafka.producer();
    yield producer.connect();
    while (1) {
        const runs = yield db.zaprunoutbox.findMany({
            where: {},
            take: 10
        });
        producer.send({
            topic: "kafka-event",
            messages: runs.map(run => ({ value: run.ZapRunId }))
        });
        yield db.zaprunoutbox.deleteMany({
            where: {
                id: {
                    in: runs.map(run => run.id)
                }
            }
        });
    }
});
main();
