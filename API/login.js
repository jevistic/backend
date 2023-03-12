const express = require("express");
const app = express();

let login = app.post('/login', async (req, res)=>{

    const { email, password } = req.body;
    try{

        const result = await User.findOne( {email: email, password: password} )

        if(result==null){
            res.send("Invalid credentials")
            // res.json({LoginFailed:"Login Failed"})
        }
        
        else{
    
            const obj = {
                id:result._id
            }
        
            const Token = JWT.sign(obj,myKey)
        
            res.cookie("Token",Token);
           
            // res.json("Signed in as: " + result.firstname + " " + result.lastname);
    
            res.json({token: Token})
        }

    }
    catch(err){
        res.send(err.message)
    }  

})

module.exports = login;