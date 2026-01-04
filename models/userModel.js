import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
           
        },
        password:
        {
            type:String,
            required:[true,"Password is required."],
            minlength:[6,"Password must be at least 6 characters long."]

        },
        otp: {
            type: String,
            default: null
        },
        otpExpiry: {
            type: Date,
            default: null
        }
    },
    {
        timestamps:true,
        collection:"users"
    }
);



// Add a virtual field for IST time
userSchema.virtual("createdAtIST").get(function () {
  return new Date(this.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
});

userSchema.virtual("updatedAtIST").get(function () {
  return new Date(this.updatedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
});


// Enable virtuals in JSON responses
userSchema.set("toJSON", { virtuals: true });

export default mongoose.model("User",userSchema);