const express = require('express');
const app = express();
const DBconfig = require('./config/DBconfig');
const cors = require('cors');
const cookieParser =  require("cookie-parser")
const JWT = require('jsonwebtoken')
require('dotenv').config();
// Created Modules
const User = require("./Models/User");
const Exercise = require("./Models/Exercise");
const Middlewares = require('./Middlewares/Middlewares')
// const APIs = require('./Routes/api')

const {JWT_KEY} = require('./config/keys')

//Connect to DB
DBconfig();

//Middleware to parse res.body
app.use(express.json())
// parse cookies
app.use(cookieParser());
// allow cors
app.use(cors());
// Created Middlewares
Middlewares(app, JWT);

// Secret Key
// const jwt_key = process.env.JWT_KEY;

// APIs
app.get('/', (req, res) => {
    res.send("Homepage");
})
app.post('/login', async (req, res)=>{
    const { email, password } = req.body;
    try {
        const result = await User.findOne( {email: email, password: password} )
        if (result==null) {
            const data = {
                "message": "Invalid credentials!"
            };
            res.status(401).send(data)
        }
        else{
            const obj = {
                id:result._id
            }
        
            const Token = JWT.sign(obj,JWT_KEY)
        
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
app.post('/register',  async (req, res) => {
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
    
        const Token = JWT.sign(obj,JWT_KEY)
    
        res.cookie("Token",Token)
        console.log(result)
        const data = {
            "message": "User Registered Successfully!",
            "token": Token
        };
        res.send(data)
    }
    catch(err){
        let custom_errors = {}
        if(err.code==11000){
           custom_errors["Duplicate"] = "Email Already Exsit"
        }
        for (const field in err.errors) {
            custom_errors[field] = err.errors[field].message;
            // res.status(403).send( custom_errors );
        }
        // const key = Object.keys(err.errors)[0];
        
       
        res.status(403).send( custom_errors );
    }
})
app.put('/updateUser',  async (req, res) => {
    const id = req.data.id;
    const {firstname, lastname, email, phone, password, dob, gender} = req.body;
    try {
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
app.post('/addExercise', async (req, res) => {
    const {name, description, type, duration, date} = req.body;
    try {
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
    try {
        const result = await Exercise.updateOne( myQuery, newValues )
        res.send("Exercise updated successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
})
app.get('/getAllExercises', async (req, res) => {
    let result;
    try {
        let userId = req.data.id;
        result = await User.findById(userId).populate("exercises");
        //const r = await JSON.stringify(result);
        res.send(result.exercises);
    }
    catch(err){
        console.log(err.message);
        res.send(err.message)
    }
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
    try {
        const {id} = req.body;
        const result = await Exercise.findOne({_id : id})
        // const data = await JSON.stringify(result);
        // const data = {
        //      "message": "User Registered Successfully!",
        //      "token": Token
        //  };
         res.send(result)
     }
     catch (err) {
        res.status(403).send( err.message );
     }
})
app.get('/getExerciseByType', async (req, res)=>{
    const {type} = req.body;
    const result = await Exercise.findOne({type : type})
    const r = await JSON.stringify(result);
    res.send(r);
})
app.post('/deleteExerciseById', async (req, res)=>{
    const {id} = req.body;
    console.log(id);
    try {
        const result = await Exercise.deleteOne({_id : id})
        const r = await JSON.stringify(result);
        res.send(r);
    } catch (error) {
        res.status(404).send(error.message);
    }
})
app.get('/logout', (req, res)=>{
    //const userId = req.data.id;
    req.cookie("Token", null);
})

// Listening Server
app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})