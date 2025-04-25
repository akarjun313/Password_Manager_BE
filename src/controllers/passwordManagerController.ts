//      ALL PASSWORD MANAGER CONTROLLERS

import { Request, Response } from "express"
import { CreatePasswordEntry } from "@interfaces/all_Interfaces.js"
import prisma from "@lib/prisma.js"
import { decrypt, encrypt } from "@utils/encryption.js"


// Add new data
export const addData = async (req: Request<{}, {}, CreatePasswordEntry>, res: Response): Promise<void> => {
    try {
        const { title, username, password } = req.body
        const userId: string | undefined = req.user?.id         // Get user ID from request


        // Check if user is authenticated
        if (!userId) {
            res.status(401).json({ message: "Unauthorized", success: false })
            return
        }

        // Check for required fields
        if (!title || !username || !password) {
            res.status(400).json({ message: "All fields are required", success: false })
            return
        }

        // Check for duplicate entry
        const existingEntry: any = await prisma.userPasswords.findFirst({
            where: { userId, title }
        })
        if (existingEntry) {
            res.status(400).json({ message: "Entry already exists", success: false })
            return
        }


        // Encrypt password
        const encryptedData: string = encrypt(password)

        await prisma.userPasswords.create({
            data: {
                title,
                username,
                encryptedPassword: encryptedData,
                userId
            }
        })


        // Success message
        res.status(200).json({ message: "Data added successfully", success: true })
    } catch (error) {
        console.log("Internal server error in addData: ", error)
        res.status(500).json({ message: "Internal server error in addData", success: false })
    }
}


// Edit existing data
export const editData = async (req: Request<{ id: string }, {}, CreatePasswordEntry>, res: Response): Promise<void> => {
    try {

        const { id } = req.params    // Password entry ID

        const { username, password } = req.body     // Data which is to be edited

        const dataToUpdate: any = {}     // Data to be updated

        if (username) dataToUpdate.username = username  // Update username
        if (password) dataToUpdate.encryptedPassword = encrypt(password)    // Update password

        // Update data in DB
        await prisma.userPasswords.update({
            where: {
                id
            },
            data: dataToUpdate
        })


        res.status(200).json({ message: "Data updated successfully", success: true })
    } catch (error) {
        console.log("Error in editData: ", error)
        res.status(500).json({ message: "Internal server error in editData", success: false })
    }
}



// Get all data
export const getAllData = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId: string | undefined = req.user?.id         // Get user ID from request
        if (!userId) {
            res.status(401).json({ message: "Unauthorized access", success: false })
            return
        }


        // Fetch all data by User
        const allData = await prisma.userPasswords.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                title: true,
                username: true,
            }
        })

        // Check if no data found
        if (allData.length === 0) {
            res.status(404).json({ message: "No data found for the user", success: false })
            return
        }


        // Return a success message with fetched data
        res.status(200).json({ message: "Data retrieved successfully", success: true, data: allData })

    } catch (error) {
        console.log("Error in getAllData: ", error)
        res.status(500).json({ message: "Internal server error in fetching all data", success: false })
    }
}


// Get data by id
export const getSingleDataByUser = async (req: Request<{ id: string }, {}, CreatePasswordEntry>, res: Response): Promise<void> => {
    try {

        const { id } = req.params       // Get Password ID from request

        // Find desired data
        const desiredData = await prisma.userPasswords.findUnique({
            where: {
                id
            }
        })
        if (!desiredData) {
            res.status(404).json({ message: "Data not found", success: false })
            return
        }

        // Decrypt the password
        const decryptedPassword: string = decrypt(desiredData.encryptedPassword)

        // Remove encrypted password from response
        const { encryptedPassword, ...safeData } = desiredData


        // Return a success message with fetched data
        res.status(200).json({ message: "Data retrieved successfully", success: true, data: { ...safeData, password: decryptedPassword } })

    } catch (error) {
        console.log("Error in getSingleDataByUser: ", error)
        res.status(500).json({ message: "Internal server error in fetching single data", success: false })
    }
}

// Delete existing data
export const deleteSingleEntry = async (req: Request<{ id: string }, {}, CreatePasswordEntry>, res: Response): Promise<void> => {

    // Get Password entry ID
    const { id } = req.params

    // Delete Enty
    try {
        await prisma.userPasswords.delete({
            where: {
                id
            }
        })

        res.status(200).json({ message: "Record deleted successfully", success: true })
    } catch (DelErr) {
        res.status(404).json({ message: "Record not found", success: false })
    }
}