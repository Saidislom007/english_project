const BaseError = require('../errors/base.error')
module.exports = function (err,req,res,next){
    console.log(err)
    
    if (err instanceof BaseError){
        return res.status(err.status).jsom({message:err.message,errors:err.errors})

    }

    return res.status(500).json({message:"Server error"})
}