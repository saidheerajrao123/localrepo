const mongoose=require('mongoose')

// Create user schema(name,age,email)
const userSchema = new mongoose.Schema(
  {
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:70 
    }
  },
  { strict: "throw" }
)
// create model for userSchema
const UserModel = mongoose.model("user", userSchema)

// export userModel
module.exports=UserModel;
