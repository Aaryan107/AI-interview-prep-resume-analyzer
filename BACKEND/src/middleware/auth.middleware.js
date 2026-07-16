const blackListModel=require('../models/blacklist.model')
const jwt=require('jsonwebtoken')
async function authUser(req,res,next){

    const token=req.cookies.token

    if(!token){
        return res.status(401).json({message:'unauthorized'})
    }

    try{

    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=decoded
    next()
    }catch(error){
        return res.status(401).json({message:'unauthorized'})
    }
    
    // const blacklistedToken=await blackListModel.findOne({token})

    // if(blacklistedToken){
    //     return res.status(401).json({message:'unauthorized'})
    // }

    

}

module.exports={authUser
}