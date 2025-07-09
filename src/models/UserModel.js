const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 2,
        maxlength : 100,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
         minlength : 2,
        maxlength : 100,
        trim : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Enter a valid Email");
            }
        }
    },
    password : {
        type: String,
         required : true,
        maxlength : 500,
          validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Enter a strong password");
            }
        }
    }
}, {timestamps : true});

const UserModel = mongoose.model("user", userSchema);

module.exports = {UserModel}