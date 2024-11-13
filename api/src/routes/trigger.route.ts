import {  Router } from "express"
import { getTrigger } from "../controller/trigger.controller"

const router = Router()

router.get('/available', getTrigger)

export const triggerRouter = router