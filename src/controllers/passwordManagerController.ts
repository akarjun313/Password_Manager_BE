//      ALL PASSWORD MANAGER CONTROLLERS

import { Request, Response } from "express"
import { CreatePasswordEntry } from "@interfaces/passwordEntryInterface.js"
import prisma from "@lib/prisma.js"


// Add new data
export const addData = async (req: Request<{}, {}, CreatePasswordEntry>, res: Response): Promise<void> => {
    try {
        const { title, username, password } = req.body
        const userId: string | undefined = req.user?.id

        // Check for required fields
        if (!title || !username || !password) {
            res.status(400).json({ message: "All fields are required", success: false })
            return
        }

        // Check for duplicate entry
        const existingEntry = await prisma.userPasswords.findFirst({
            where: { userId, title }
        })
        if (existingEntry) {
            res.status(400).json({ message: "Entry already exists", success: false })
            return
        }

        


        // Success message
        res.status(200).json({ message: "Data added successfully", success: true })
    } catch (error) {
        console.log(error)
    }
}


// Edit existing data
// Delete existing data
// Get all data
// Get data by id