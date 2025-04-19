import { Request, Response } from "express"
import { IUser } from "@interfaces/userInterface.js"
import prisma from "@lib/prisma.js"
import bcrypt from "bcrypt"
import { generateUserToken } from "@utils/generateToken.js"


export const signUp = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body

        // check if user already exists
        const userExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (userExist) {
            res.status(400).json({ message: "User already exists", success: false })
            return
        }


        // hash password
        const saltRounds: number = 10
        const hashPassword: string = await bcrypt.hash(password, saltRounds)

        // create new user 
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashPassword,
                role
            }
        })

        // generating user token using jwt 
        const token: string = generateUserToken(newUser)

        // set token to cookies 
        res.cookie('token', token, {
            httpOnly: true,
        })


        res.status(200).json({ message: "User sign-up success", success: true })
    } catch (error) {
        console.error("signUp error: " ,error)
        res.status(500).json({ message: "Internal server error during user sign-up", success: false })
    }
}