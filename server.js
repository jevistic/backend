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
app.use(["/addExercise", "/getAllExercises", "updateUser", "updateExerciseById", "/getUser", "/deleteUser"],(req,res,next)=>{
    
    const Token =  req.cookies.Token;

     if(Token==null){

         res.status(400).send("No Token Available!")

     }

     else{

         JWT.verify(Token,myKey,(err,user)=>{
             if(err){
                 res.status(401).send("Not Authenticated!")
             }
             req.data =  user;
             next()
         })
     }
 
 })



app.get('/', (req, res)=>{
    res.send("Homepage");
})


app.post('/login', async (req, res)=>{

    const { email, password } = req.body;
    try{

        const result = await User.findOne( {email: email, password: password} )

        if(result==null){
            const data = {
                "message": "Invalid credentials!"
            };
            res.status(401).send(data)
        }
        
        else{
    
            const obj = {
                id:result._id
            }
        
            const Token = JWT.sign(obj,myKey)
        
            res.cookie("Token",Token);
           
            // res.json("Signed in as: " + result.firstname + " " + result.lastname);
    
            const data = {
                "message": "Loggedin Successfully!",
                "token": Token
            };
            res.send(data)
            // res.json({token: Token})
        }

    }
    catch(err){
        res.status(400).send(err.message);
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
            id:result["_id"]      
        }
    
        const Token = JWT.sign(obj,myKey)
    
        res.cookie("Token",Token)
        console.log(result)

        const data = {
            "message": "User Registered Successfully!",
            "token": Token
        };
        res.send(data)
    }
    catch(err){
        res.status(400).send(err.message);
    }
})



app.put('/updateUser',  async (req, res)=>{
    const id = req.data.id;
    const {firstname, lastname, email, phone, password, dob, gender} = req.body;

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
        let userId = req.data.id;
        
        const result = await Exercise.create({
            name: name,
            description: description,
            type: type,
            duration: duration,
            date: date
        });

        const a = await User.findByIdAndUpdate({_id: userId}, { $push: { exercises: result._id } });
        res.send("Exercise added successfully!");
        console.log(result);
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

    let result;
    try{
        let userId = req.data.id;

        result = await User.findById(userId).populate("exercises")
    }
    catch(err){
        console.log(err.message);
        res.send(err.message)
    }
    
    //const r = await JSON.stringify(result);

    res.send(result.exercises);
})

app.get('/getUser', async (req, res)=>{

    const id = req.data.id;

    const result = await User.findOne({_id: id});

    //const r = await JSON.stringify(result);
    res.send(result);
    
})

app.delete('/deleteUser', async (req, res)=>{

    const id = req.data.id;

    const result = await User.deleteOne({_id: id});

    // const r = await JSON.stringify(result);
    res.cookie("Token",null);
    res.send(result);
    
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

app.get('/logout', (req, res)=>{
    //const userId = req.data.id;
    req.cookie("Token", null);
})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})