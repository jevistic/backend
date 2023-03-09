const express = require('express');
const DBconfig = require('./DBconfig/DBconfig');
const app = express();

const cors = require('cors');

const JWT =  require('jsonwebtoken')

const cookieParser =  require("cookie-parser")

const User = require("./model/User");
const Exercise = require("./model/Exercise");

//Connect to DB
DBconfig();

//Secret Key
const myKey = "123!@#aJK";

//Middleware to parse res.body
app.use(express.json())

//Middleware to parse cookies
app.use(cookieParser());

//Middleware to allow cors
app.use(cors());


//Authentication
app.use(["/addExercise", "/getAllExercises", "updateUserById", "updateExerciseById", '/getUserById'],(req,res,next)=>{
    
    const Token =  req.cookies.Token;

     if(Token==null){

         res.status(400).send("No Token Available!")

     }

     else{

         JWT.verify(Token,myKey,(err,user)=>{
             if(err){
                 res.status(401).send("Not Authenticated!")
             }
             //req.MyUser =  user
             next()
         })
     }
 
 })



app.get('/', (req, res)=>{
    res.send("Homepage");
})


app.post('/login', async (req, res)=>{

    const { email, password } = req.body;

    const result = await User.findOne( {email: email, password: password} )

    if(result==null){
        res.json("Login failed!")
    }
    
    else{

        const obj = {
            id:result._id,
            email:result.email      
         }
    
         const Token = JWT.sign(obj,myKey)
    
        //  res.cookie("Token",Token);
       
        // res.json("Signed in as: " + result.firstname + " " + result.lastname);

        res.json({token: Token})
    }


})


app.post('/register',  async (req, res)=>{
    const {firstname, lastname, email, phone, password, dob, gender} = req.body;

    try{
       const result = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password,
            dob: dob,
            gender: gender
        })

        const obj = {
            id:result["_id"],
            email:result["email"]       
        }
    
        const Token = JWT.sign(obj,myKey)
    
        res.cookie("Token",Token)
        console.log(result)

        res.send("User Registered Successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
})



app.put('/updateUserById',  async (req, res)=>{
    const {id, firstname, lastname, email, phone, password, dob, gender} = req.body;

    try{
       const result = await User.updateOne({_id: id}, {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password,
            dob: dob,
            gender: gender
        })

        res.send("User Updated Successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
})



app.post('/addExercise', async (req, res)=>{

    const {name, description, type, duration, date} = req.body;

    try{
        const result = await Exercise.create({
            name: name,
            description: description,
            type: type,
            duration: duration,
            date: date
        })
        res.send("Exercise added successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})


app.put('/updateExerciseById', async (req, res)=>{

    const {id, name, description, type, duration, date} = req.body;

    var myQuery = { _id: id };
    var newValues = { $set: {name: name, description: description, type: type, duration: duration, date: date } };

    try{
        const result = await Exercise.updateOne( myQuery, newValues )
        res.send("Exercise updated successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})


app.get('/getAllExercises', async (req, res)=>{

    const result = await Exercise.find({})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getUserById', async (req, res)=>{

    const {id} = req.body;

    const result = await User.findOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.delete('/deleteUserById', async (req, res)=>{

    const {id} = req.body;

    const result = await User.deleteOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.get('/getExerciseById', async (req, res)=>{

    const {id} = req.body;

    const result = await Exercise.findOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getExerciseByType', async (req, res)=>{

    const {type} = req.body;
    
    const result = await Exercise.findOne({type : type})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.delete('/deleteExerciseById', async (req, res)=>{

    const {id} = req.body;
    
    const result = await Exercise.deleteOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})