const express = require('express');
const DBconfig = require('./DBconfig/DBconfig');
const app = express();

const JWT =  require("jsonwebtoken")
const cookieParser =  require("cookie-parser")

const usersSchema = require("./model/usersSchema");
const exercisesSchema = require("./model/exercisesSchema");

//Connect to DB
DBconfig();

//Secret Key
const myKey = "123!@#aJK";

//Middleware to parse res.body
app.use(express.json())


//Authentication
app.use(["/addExercise", "/getAllExercises"],(req,res,next)=>{
    
    const Token =  req.cookies.Token

     if(Token==null){

         res.status(400).send("No Token Available!")

     }

     else{

         JWT.verify(Token,myKey,(err,user)=>{
             if(err){
                 res.status(401).send("Not Authenticated!")
             }
             req.MyUser =  user
             next()
         })
     }
 
 })



app.get('/', (req, res)=>{
    res.send("Homepage");
})


app.get('/login', async (req, res)=>{

    const { email, password } = req.body;

    const result = await usersSchema.findOne( {email: email, password: password} )

    if(result==null){
        res.send("Login failed!")
    }
    
    else{

        const obj = {
            id:result._id,
            email:result.email      
         }
    
         const Token = JWT.sign(obj,myKey)
    
         res.cookie("Token",Token);
       
        res.send("Signed in as: " + result.firstname + " " + result.lastname);
    }


})


app.post('/register',  async (req, res)=>{
    const {firstname, lastname, email, phone, password, dob, gender} = req.body;

    try{
       const result = await usersSchema.create({
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
       const result = await usersSchema.updateOne({_id: id}, {
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
        const result = await exercisesSchema.create({
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
        const result = await exercisesSchema.updateOne( myQuery, newValues )
        res.send("Exercise updated successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})


app.get('/getAllExercises', async (req, res)=>{

    const result = await exercisesSchema.find({})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getUserById', async (req, res)=>{

    const {id} = req.body;

    const result = await usersSchema.findOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.delete('/deleteUserById', async (req, res)=>{

    const {id} = req.body;

    const result = await usersSchema.deleteOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.get('/getExerciseById', async (req, res)=>{

    const {id} = req.body;

    const result = await exercisesSchema.findOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getExerciseByType', async (req, res)=>{

    const {type} = req.body;
    
    const result = await exercisesSchema.findOne({type : type})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.delete('/deleteExerciseById', async (req, res)=>{

    const {id} = req.body;
    
    const result = await exercisesSchema.deleteOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})