require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MongoDB_ADD).then(()=>{
    console.log("Connection Successful")
}).catch((e)=>{
    console.log(e);
});