const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/?directConnection=true&readPreference=primary"

const connectToMongo = () => {
    
    mongoose.connect(mongoURI, ).then(()=>{
        console.info("connected")
    }).catch((error)=>{
        console.log("Error: ",error)
    });
}

module.exports = connectToMongo;