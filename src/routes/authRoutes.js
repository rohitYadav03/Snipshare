const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/checkAuth");

require("dotenv").config()

const authRouter = express.Router();

authRouter.post("/signup", async(req,res) => {
    try {
        const {name , email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message : "all feild are required"})
        }
        const hashPassword = await bcrypt.hash(password,10)
    const userDetails = new UserModel({name,email, password : hashPassword});
    await userDetails.save();

    res.status(201).json({message : "signup done"})
    } catch (error) {
        if(error.code === 11000){
            return res.status(400).json({ message: "Email already registered" });
        }
        res.status(500).json({message : `ERROR : ${error.message}`})
    }
})

authRouter.post("/login", async(req,res) => {
 try {
   const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json({message : "Enter the details first"})
  }

  const validEmail = await UserModel.findOne({email})
  if(!validEmail){
    return res.status(400).json({message : "Email is not register"})
  }

  const validPassword = await bcrypt.compare(password, validEmail.password);
  if(!validPassword){
    return res.status(400).json({message : "wrong password "})
  }
  // now the user has enter the right email and password so -> crete the token , store the token then send the response 
const token = jwt.sign({_id : validEmail._id},process.env.JWT_SECRET,{expiresIn : "7d"})

const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

res.cookie("login", token,{
httpOnly : true,
sameSite : "strict",
secure : false , // true in production -> means https only 
expires : expiryDate
})

res.status(200).json({message : "Login done"})
 } catch (error) {
  res.status(400).json({message : `ERROR : ${error.message}`})
 }
})

authRouter.post("/logout",authenticateToken, (req,res) => {
try {
  res.clearCookie("login", {
    httpOnly : true,
sameSite : "strict",
secure : false , // true in production -> means https only 
  })
  res.status(200).json({message : "logout done"})
} catch (error) {
  res.status(400).json({message : `ERROR : ${error.message}`})
}
})

module.exports = {authRouter};