const express = require('express');

const app = express();

app.get('/login', (req, res)=>{
    res.send("Hello Login");
})

app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.post('/register', (req, res)=>{

    res.send("Hello register");
})


app.listen(3000, ()=>{
    console.log("App is listening at port 3000")
})