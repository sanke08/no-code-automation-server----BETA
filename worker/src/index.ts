import { JsonObject } from "@prisma/client/runtime/library";
import { db } from "./utils/db";
import { kafka } from "./utils/kafka";
import { parse } from "./utils/parse";
import { sendEmail } from "./utils/email";


const main = async () => {

    const consumer = kafka.consumer({ groupId: 'worker' });
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: "zap-event", fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ message, partition }) => {
            if (!message.value?.toString()) return;

            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await db.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            })

            const currentAction = zapRunDetails?.zap.actions.find((x) => x.sortingOrder === stage)

            if (!currentAction) {
                return;
            }

            const zapRunMetadata = zapRunDetails?.metadata;

            if (currentAction.type.id === "email") {
                const body = parse((currentAction.metaData as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metaData as JsonObject)?.email as string, zapRunMetadata);
                console.log(`Sending out email to ${to} body is ${body}`)
                await sendEmail(to, body);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;

            if (lastStage !== stage) {
                // push back to queue

                await producer.send({
                    topic: "zap-event",
                    messages: [{
                        value: JSON.stringify({ zapRunId, stage: stage + 1 })
                    }]
                })
            }
            await consumer.commitOffsets([{
                topic: "zap-event",
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])

        }
    })

}

main()