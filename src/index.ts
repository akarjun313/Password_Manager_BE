import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"

//Type extension
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                role: 'BASIC' | 'ADMIN'
            }    
        }
    }
}



const app = express()

const port: number = 3003   // port number

// Middlewares
app.use(express.json())     // automatically parse incoming JSON request bodies
app.use(cookieParser())     // read and parse cookies from incoming requests


app.get("/", (_req: Request, res: Response) => {
    res.send("Password manager server")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})