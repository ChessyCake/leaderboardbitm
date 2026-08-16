import "dotenv/config";
process.env.TZ = "Asia/Kolkata";
import app from "./app/app"
import { connectDB } from "./config/db"
import { startPoller } from "./services/poller";



const PORT = process.env.PORT || 4000

const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "BOT_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET",
    "BACKEND_URL",
    "FRONTEND_URL"
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}

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