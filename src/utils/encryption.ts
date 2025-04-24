import crypto from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config()


// encryption algorithm
const algorithm: string = 'aes-256-cbc'

// secure random 32-byte( 256-bit ) key (in hex format)
const secretKey: string = process.env.ENCRYPTION_KEY! as string


// password encryption function
export const encrypt = (text: string): string  => {
    const iv: Buffer = crypto.randomBytes(16)       // 16 bytes for AES-CBC
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'), 
        cipher.final()
    ])


    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}


// password decryption function
export const decrypt = (encryptedText: string): string => {
    const [ivHex, encryptedHex] = encryptedText.split(':')

    const iv = Buffer.from(ivHex, 'hex')
    const encryptedData = Buffer.from(encryptedHex, 'hex')

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)

    const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
    ])

    return decrypted.toString('utf-8')
}