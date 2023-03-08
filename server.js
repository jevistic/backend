const express = require('express');
const DBconfig = require('./DBconfig/DBconfig');
const app = express();

const usersSchema = require("./model/usersSchema");
const exercisesSchema = require("./model/exercisesSchema");

//Connect to DB
DBconfig();

//Middleware for JSON data
app.use(express.json())


app.get('/', (req, res)=>{
    res.send("Hello World");
})


app.post('/login', async (req, res)=>{

    const { email, password } = req.body;
    const result = await usersSchema.findOne( {email: email, password: password} )
    if(result)
        res.send("Logged in successfully as " + email);
    else
        res.send("Login failed");

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

        res.send("User Registered Successfully!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
})



app.put('/updateuserbyid',  async (req, res)=>{
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



app.post('/addexercise', async (req, res)=>{

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


app.put('/updateexercisebyid', async (req, res)=>{

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


app.get('/getexercises', async (req, res)=>{

    const result = await exercisesSchema.find({})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getuserbyid', async (req, res)=>{

    const {id} = req.body;

    const result = await usersSchema.findOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.delete('/deleteuserbyid', async (req, res)=>{

    const {id} = req.body;

    const result = await usersSchema.deleteOne({_id: id});

    const r = await JSON.stringify(result);
    res.send(r);
    
})

app.get('/getexercisebyid', async (req, res)=>{

    const {id} = req.body;

    const result = await exercisesSchema.findOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.get('/getexercisebytype', async (req, res)=>{

    const {type} = req.body;
    
    const result = await exercisesSchema.findOne({type : type})
    const r = await JSON.stringify(result);
    res.send(r);

})

app.delete('/deleteexercisebyid', async (req, res)=>{

    const {id} = req.body;
    
    const result = await exercisesSchema.deleteOne({_id : id})
    const r = await JSON.stringify(result);
    res.send(r);

})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})