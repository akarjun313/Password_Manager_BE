import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "@lib/prisma.js"

dotenv.config()



export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Fetching token from cookies
        const token: string | undefined = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", success: false })
        }


        // jwt verification 
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload


        // checking user existance 
        const userExist = await prisma.user.findUnique({
            where: {
                email: decoded.email
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        })
        if (!userExist) {
            return res.status(401).json({ message: "Unauthorized", success: false })
        }


        // adding user to Request
        req.user = userExist
        next()


        
    } catch (error) {

        //Handling possible errors

        console.error("Authentication Error : ",error)

        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid Token", success: false })
        }

        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token Expired", success: false })
        }

        res.status(500).json({ message: "Internal Server Error, at Authentication", success: false })
    }
}