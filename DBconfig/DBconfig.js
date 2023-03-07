const mongoose = require('mongoose');

let DBconfig = ()=>{
    mongoose.connect("mongodb://localhost:27017/users").then(()=>{
    console.log("I am connected");
})

}

module.exports = DBconfig;