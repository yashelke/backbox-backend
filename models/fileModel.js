import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fileName:
    {
        type:String,
        required:true
    },
    fileType:
    {
        type:String,
        required:true
    },
    url:
    {
        type:String,
        required:true
    },
    publicId:
    {
        type:String,
        required:true
    },
    uploadedAt:
    {
        type:Date,
        default:Date.now
    }

});

export default mongoose.model("File",fileSchema);