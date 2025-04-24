    
    
    //          ALL USER RELATED CONTROLS GO HERE

import { Request, Response } from "express"
import { IUser } from "@interfaces/all_Interfaces.js"
import prisma from "@lib/prisma.js"
import bcrypt from "bcrypt"
import { generateUserToken } from "@utils/generateToken.js"


// signup user
export const signUp = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body

        // check if user already exists
        const userExist: IUser | null = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (userExist) {
            res.status(401).json({ message: "User already exists", success: false })
            return
        }


        // hash password
        const saltRounds: number = 10
        const hashPassword: string = await bcrypt.hash(password, saltRounds)

        // create new user 
        const newUser: IUser = await prisma.user.create({
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
        console.error("signUp error: ", error)
        res.status(500).json({ message: "Internal server error during user sign-up", success: false })
    }
}


// login user
export const userLogin = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        // check if user exists
        const userExist: IUser | null = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!userExist) {
            res.status(401).json({ message: "User does not exist", success: false })
            return
        }


        // verify password
        const isPasswordMatch: boolean = await bcrypt.compare(password, userExist.hashPassword)
        if(!isPasswordMatch) {
            res.status(401).json({ message: "Invalid password", success: false })
            return
        }
        
        // generating user token using jwt
        const token: string = generateUserToken(userExist)

        // set token to cookies
        res.cookie('token', token, {
            httpOnly: true,
        })

        res.status(200).json({ message: "User login success", success: true })

    } catch (error) {
        console.error("userLogin error: ", error)
        res.status(500).json({ message: "Internal server error during user login", success: false })
    }
}