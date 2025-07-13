const express = require("express");
const { authenticateToken } = require("../middleware/checkAuth");
const { UserModel } = require("../models/UserModel");
const validator = require("validator")
const ProfileRouter = express.Router();
const bcrypt = require("bcrypt")

ProfileRouter.get("/",authenticateToken, async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        if(!loggedInUserId){
            return res.status(400).json({message : "login again"})
        }
        const userDetails = await UserModel.findById(loggedInUserId).select("name email");
        if(!userDetails){
            return res.status(400).json({message : "user details not found"})
        }
      res.status(200).json({message : userDetails})

    } catch (error) {
        res.status(400).json({message : `ERROR  : ${error.message}`})
    }
})


ProfileRouter.patch("/", authenticateToken, async(req,res) => {
    try {
        const {email , name} = req.body;
        if(!email && !name){
            return res.status(400).json({message : "enter the details you want to update"})
        }
        if(email && !validator.isEmail(email)){
  return res.status(400).json({message : "enter the vaild email"})
        }
       if (name && (name.length < 3 || name.length > 50)) {
  return res.status(400).json({message : "Name must be between 3 to 50 characters"});
}

        const updatedData = await UserModel.findByIdAndUpdate(req.user._id, {name , email}, {runValidators : true});

        res.status(200).json({message : "details updated suceesfully"})
    } catch (error) {
                res.status(400).json({message : `ERROR  : ${error.message}`})
    }
})

ProfileRouter.patch("/password", authenticateToken, async(req,res) => {
    try {
        
        const {oldPassword , newPassword} = req.body;
        if(!oldPassword || !newPassword){
   return res.status(400).json({message : "enter the details you want to update"})
        }
        if(oldPassword === newPassword){
    return res.status(400).json({message : "old Password cannot be same as new one"})
        }
        if(!validator.isStrongPassword(newPassword)){
       return res.status(400).json({message : "enter a strong password"})
        }
        const userDetails = await UserModel.findById(req.user._id);

const compareOldPassword = await bcrypt.compare(oldPassword, userDetails.password);

if(!compareOldPassword){
    return res.status(400).json({message : "old passwor dis incoorect"})
}

const newHashPassword = await bcrypt.hash(newPassword , 10)
 userDetails.password = newHashPassword;
 await userDetails.save();

 res.status(200).json({message : "password update"})


    } catch (error) {
 res.status(400).json({message : `ERROR : ${error.message}`})

    }
})

module.exports = { ProfileRouter };