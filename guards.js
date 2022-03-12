const db = require('./database')

const adminGuard = (req,res,next)=>{
    const user = db.getByEmail(req.user.email);
    if(user?.role === 'admin'){
     return   next()
    }
    return res.status(401).json({message: 'You are not allowed'});
}

module.exports = adminGuard