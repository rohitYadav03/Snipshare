const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const authenticateToken = (req,res, next) => {
    try {
        const authCokiee = req.cookies.login;
    if(!authCokiee){
        return res.status(400).json({message : "no cokkie found login again"})
    }
    const  validCokkie = jwt.verify(authCokiee, process.env.JWT_SECRET);
    
    req.user = validCokkie;
    next();
    } catch (error) {
        res.status(400).json({message : `ERROR : ${error.message}`})
    }
}

module.exports = {authenticateToken};