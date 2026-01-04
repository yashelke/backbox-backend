import mongoose from "mongoose";

const connectDB = async () =>
{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>
    {
        console.log("MongoDB connected successfully.")
    })
    .catch((error) =>
    {
        console.error("MongoDB connection failed: ", error.message)
    })
}

export default connectDB;