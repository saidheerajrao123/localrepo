const exp = require("express")
const userApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const mongoose = require("mongoose")

// add body parser middleware
userApp.use(exp.json())
// Create user schema(name,age,email)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 20,
    max: 60,
  },
  email: {
    type: String,
    required: true,
  },
},{"strict":"throw"})
// create model for userSchema
const UserModel = mongoose.model("user", userSchema)

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

//create new user
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    // get new user object
    const newUser = req.body
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

// expoort userApp
module.exports = userApp
