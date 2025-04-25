import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import myRouter from "@routes/allRoutes.js"
import cors from "cors"
import { corsOptions } from "@utils/corsConfig.js"

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



const app: Application = express()

const port: number = 3003   // port number

// Middlewares
app.use(express.json())     // automatically parse incoming JSON request bodies
app.use(cookieParser())     // read and parse cookies from incoming requests
app.use(cors(corsOptions))   // enable CORS

app.use('/api/v1', myRouter)    // use router


app.get("/", (_req: Request, res: Response) => {
    res.send("Password manager server")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})