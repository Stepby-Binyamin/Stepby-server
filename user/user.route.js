const express = require("express")
const router = express.Router()

// const userController = require("./user.control")

router.get("/all", (req , res)=>{
    // #swagger.summary = 'summary'
    // #swagger.tags = ['Users']
    // #swagger.description = 'Some description...'
    console.log("nehorai");
    
    res.send("Welcome")
})


module.exports= router