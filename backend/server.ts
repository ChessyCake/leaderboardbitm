import dotenv from "dotenv"
dotenv.config()

import app from "./app/app"
import { connectDB } from "./config/db"


const PORT = process.env.PORT || 5000


const serverStart = async () => {
    try {
        await connectDB()

        app.listen( PORT, ()=> {
            console.log(`Server successfully running on port:${PORT}`)
        });
    } catch(err) {
        console.error("Failed to start server: ", err)
        process.exit(1);
    }
}

serverStart()