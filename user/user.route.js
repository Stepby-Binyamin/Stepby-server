const express = require("express")
const router = express.Router()

// const userController = require("./user.control")

router.get("/all", (req , res)=>{
    // #swagger.tags = ['User']
    // #swagger.description = 'get all users'
    console.log("nehorai");
    
    res.send("Welcome")
})


module.exports= router