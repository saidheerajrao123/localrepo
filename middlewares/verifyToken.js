const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    // TOKEN VERIFICATION LOGIC

    // get bearer token
    let bearerToken=req.headers.authorization

    // if bearerToken not found,send unauthorized
    if(!bearerToken){
        res.send({message:'Unauthorized access'})
    }else{
        // extract token from bearer token
        let token=bearerToken.split(' ')[1]
        try{
            // verify the token
            let decodedToken=jwt.verify(token,'abcdef')
            next()
        }catch(err){
            res.send({message:"Plz relogin to continue"})
        }
    }
}

module.exports=verifyToken