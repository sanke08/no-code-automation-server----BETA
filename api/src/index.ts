import express from "express"
import cors from "cors"
import { zapRouter } from "./routes/zap.route"
import { actionRouter } from "./routes/action.route"
import { triggerRouter } from "./routes/trigger.route"
import { userRouter } from "./routes/user.route"

const app = express()

app.use(express.json())
app.use(cors())


app.use("/api/v1/user", userRouter)
app.use("/api/v1/zap", zapRouter)
app.use("/api/v1/trigger", triggerRouter)
app.use("/api/v1/action", actionRouter) 


app.listen(8000, () => {
    console.log("Server is running on port 3000")
})


