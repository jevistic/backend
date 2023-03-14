const mongoose = require('mongoose');

const Database = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/users").then( () => {
        console.log("Database connected");
    }).catch( () => {
        console.log("Database Connection Failed");
    })
}

module.exports = Database;