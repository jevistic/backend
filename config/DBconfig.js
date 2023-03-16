const mongoose = require('mongoose');

const { MONGO_URI } = require('./keys')

let DBconfig = ()=>{
    mongoose.connect(MONGO_URI).then(()=>{

    console.log("Database connected");

    }).catch(()=>{

        console.log("Database Connection Failed");
        
    })

}

module.exports = DBconfig;