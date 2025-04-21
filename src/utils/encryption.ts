import crypto from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config()


const algorithm: string = 'aes-256-cbc'
const secretKey: string = process.env.ENCRYPTION_KEY as string
