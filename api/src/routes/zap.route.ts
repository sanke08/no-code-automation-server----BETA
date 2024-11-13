import { Router } from "express"
import { createZap, getZapById, getZaps } from "../controller/zap.controller"
import { isAuthanticated } from "../middleware"

const router = Router()

router.route('/')
    .post(isAuthanticated, createZap)
    .get(isAuthanticated, getZaps)

router.get('/:zapId', isAuthanticated, getZapById)

export const zapRouter = router