const exp = require("express")
const userApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const UserModel=require('../models/userModel')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')

// add body parser middleware
userApp.use(exp.json())



// user api
userApp.get(
  "/users",
  expressAsyncHandler(async (req, res) => {
    // get all users from users collection
    let usersList = await UserModel.find()
    // send res
    res.send({ message: "all users", payload: usersList })
  })
)
// get user details based on their name
userApp.get("/users/:name",expressAsyncHandler(async(req,res)=>{
  const userName=req.params.name
  const user=await UserModel.findOne({name:userName})
  res.send({message:"User found",payload:user})
}))

//create new user
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    // get new user object
    const newUser = req.body
    // hash the password
    const hashedPassword=await bcryptjs.hash(newUser.password,5)
    // replace plain password with hashed password
    newUser.password=hashedPassword;
    // create doc for new user
    const userDocument = new UserModel(newUser)
    // console.log(userDocument)
    // save to db
    let dbRes = await userDocument.save()
    console.log(dbRes)
    // send res
    res.send({ message: "New user created" })
  })
)

// user authentication(user login)
userApp.post('/login',expressAsyncHandler(async(req,res)=>{
  
  // get userCredObj
  const userCredObj=req.body
  // check if user is present(verify username)
  let userInDB=await UserModel.findOne({username:userCredObj.username})
  // if user is not present
  if(userInDB===null){
    res.send({message:"Invalid username"})
  }
  // if user is present,compare passwords 
  else{
    let result=await bcryptjs.compare(userCredObj.password,userInDB.password)
    if(result===false){
      res.send({message:"Invalid password"})
    }
    else{
      // create JWT token
      let signedToken=jwt.sign({username:userInDB.username},'abcdef',{expiresIn:'1d'})
      // send res
      res.send({message:"login success",token:signedToken,payload:userInDB})
    }
  }
}))

userApp.put(
  "/user",
  expressAsyncHandler(async (req, res) => {
    //get modified user from req
    const modifiedUser = req.body;
    //update
    // let updatedDoc = await UserModel.findOneAndUpdate(
    //   { name: modifiedUser.name },
    //   { $set: { ...modifiedUser } },
    //   { returnOriginal: false }
    // );
    let updatedDoc = await UserModel.findByIdAndUpdate(
      modifiedUser._id,
      { $set: { ...modifiedUser } },
      { returnOriginal: false }
    );

    //send res
    res.send({ message: "updated user", payload: updatedDoc });
  })
);

//delete user
userApp.delete(
  "/user/:_id",
  expressAsyncHandler(async (req, res) => {
    //get name from url
    // const nameOfUrl=req.params.name;
    const _id = req.params._id;
    //delete
    //let deletedUser=await UserModel.findOneAndDelete({name:nameOfUrl})
    let deletedUser = await UserModel.findByIdAndDelete(_id);
    //send res
    res.send({ messaeg: "user removed", payload: deletedUser });
  })
); 

// expoort userApp
module.exports = userApp
