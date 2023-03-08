const mongoose = require('mongoose');

let DBconfig = ()=>{
    mongoose.connect("mongodb://localhost:27017/users").then(()=>{

    console.log("I am connected");

    }).catch(()=>{

        console.log("I am Failed");
        
    })

}

module.exports = DBconfig;