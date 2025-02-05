const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 3
    },
    lastname: {
        type: String,
        required: true,
        minLength: 3
    },
    phone: {
        type: Number,
        required :true,
        minLength: 10,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID");
            }
        }
    },
    password:{
        type: String,
        required: true,
    },
    cpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]  
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token
    } catch (error) {
        res.send("Error"+error);
        console.log("Error"+error);
    }
    }
    
userSchema.pre("save", async function(next){
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10);
            this.cpassword = await bcrypt.hash(this.cpassword,10);;
        }
        next();
    })

const userRegister = new mongoose.model("userData", userSchema);
module.exports = userRegister;