import { signUp, userLogin } from "@controllers/userController.js"
import { Router, Request, Response } from "express"

const myRouter = Router()


// USER RELATED ROUTES
myRouter.post('/user/signup', signUp)       // signup user
myRouter.post('/user/login', userLogin)     // login user


// PASSWORD MANAGER RELATED ROUTES



// To Catch all fallbacks
myRouter.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found", success: false })
})


export default myRouter