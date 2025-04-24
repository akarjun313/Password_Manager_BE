        //      TOKEN UTILITY GOES HERE

import Jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { IUser } from "@interfaces/all_Interfaces.js"


dotenv.config()



export const generateUserToken = (user: IUser): string => {
    return Jwt.sign(
        { data: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    )
}