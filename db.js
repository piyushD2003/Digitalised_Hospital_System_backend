const mongoose = require('mongoose');

const connectToMongo =()=>{
    mongoose.connect('mongodb+srv://MongoHMS:dhyanipiyu7@cluster0.v5ntdgt.mongodb.net/')
}

module.exports = connectToMongo;