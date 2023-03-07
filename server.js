const express = require('express');
const DBconfig = require('./DBconfig/DBconfig')
const app = express();

//Connect to DB
DBconfig();

//Middleware for JSON data
app.use(express.json())


app.get('/', (req, res)=>{
    res.send("Hello World");
})


app.get('/login', (req, res)=>{
    res.send("Hello Login");
})


app.post('/register', (req, res)=>{
    res.send(req.body);
})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})