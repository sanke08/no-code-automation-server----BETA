import {  Router } from "express"
import { getAction } from "../controller/action.controller"

const router = Router()

router.get('/available', getAction)

export const actionRouter = router