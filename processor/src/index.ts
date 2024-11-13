import { db, kafka } from "./util";

const main = async () => {
    const producer = kafka.producer();
    await producer.connect();

    while (true) {
        const zapsProcessing = await db.zapRunOutBox.findMany({
            where: {},
            take: 10
        })

        producer.send({
            topic: "zap-event",
            messages: zapsProcessing.map((zap) => ({
                value: JSON.stringify({ zapRunId: zap.id, stage: 0 })
            }))
        })

        await db.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: zapsProcessing.map(x => x.id)
                }
            }
        })
        await new Promise(r => setTimeout(r, 3000));
    }
}
main()