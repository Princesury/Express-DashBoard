const mongoose = require('mongoose');

// uri="mongodb+srv://Prince:Prince@123@cluster0.lnolgqk.mongodb.net/cluster0?retryWrites=true&w=majority"
const connectDB = (uri) => {
    console.log('connect DB')
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:'Express_Api'
    })
}

module.exports = connectDB;