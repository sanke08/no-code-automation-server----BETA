import { Router } from "express"
import { signIn, signUp } from "../controller/user.controller"
import { getUser } from "../controller/user.controller"
import { isAuthanticated } from "../middleware"

const router = Router()

router.route('/signup').post(signUp)
router.route('/signin').post(signIn)
router.route('/user').get(isAuthanticated, getUser)
export const userRouter = router