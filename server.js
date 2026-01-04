import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import fileRouter from "./routes/fileRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://backbox-frontend.vercel.app' // Update this with your actual Vercel URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/files", fileRouter);


const PORT =process.env.PORT ;


const startServer = async () =>
{
    try{
        await connectDB();
        app.listen(PORT,()=>
        {
            console.log("MongoDB connected successfully.");
            console.log('Server is running on port ',PORT);
        });

    }
    catch(error)
    {
        console.error("Failed to start the server: ",error.message);
    }
}

startServer();