// create express app
const exp = require("express")
const app = exp()
const userApp=require('./APIs/userApi')

const mongoose = require("mongoose")

// connect to DB
mongoose.connect("mongodb://localhost:27017/vnrb3mongoose")
  .then(() => {
    app.listen(6000, () => console.log("server is listening on port 6000.."))
    console.log("DB connection is successful")
  })
  .catch((err) => {
    console.log("err in db connection ", err)
  })
 

//   if path starts with user-api,send req to userApp
app.use('/user-api',userApp)



app.use((err,req,res,next)=>{
    res.send({message:'error occured',payload:err.message})
})