import "dotenv/config";
import app from "./app/app"
import { connectDB } from "./config/db"
import {startPoller } from "./services/poller";


const PORT = process.env.PORT || 5000


const serverStart = async () => {
    try {
        await connectDB()

        app.listen( PORT,()=> {
            console.log(`Server running on port:${PORT}`)
            startPoller()
        });
    } catch(err) {
        console.error("Failed to start server: ", err)
        process.exit(1);
    }
}

serverStart()