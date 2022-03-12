const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database')
const jwt = require('jsonwebtoken');
const password = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const JwtCallback =require('./passport') 
const adminGuard = require('./guards')
require('dotenv').config()

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,

}
const auth = password.authenticate('jwt',{session: false})


app.use(express.json())
app.use(cors())
app.use(password.initialize())


password.use(new JwtStrategy(opts, JwtCallback))
 
 
 
app.post('/login', (req,res)=>{
   const user = db.login(req.body.email, req.body.password)
   if(user){
       const payload = {
           id: user.id,
           email: user.email,
           role: user.role,
       }
       const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {expiresIn:'1h'}
           )
         return  res.json({id:user.id, token: `Bearer ${token}`});
   }
   res.status(404).json({message: 'User was not found'})
})
app.get('/users',auth,adminGuard,(req,res)=>{
    res.json(db.users)
})
app.post('/register',async (req,res)=>{
    try{
      const {email,password,role} = req.body;
      db.register({email,password,role})
      res.json(db.users)
    }
    catch(e){
        console.error(e);
    }
  
})

app.listen(3000); 