const bcrypt = require('bcrypt')
const users = [];

function register(user) { 
    users.push({
        id: Math.random(),
        email: user.email,
        password: bcrypt.hashSync(user.password,10),
        role: user.role,
    })
 }

 function login(email,password) { 
    const user = getByEmail(email);
    if(user && bcrypt.compareSync(password,user.password)){
        return user;
    }
    return;
  }

  function getByEmail(email) { 
    return users.find(c=> c.email == email)
   }

 module.exports= {
     register,
     login,
     users,
     getByEmail
 }