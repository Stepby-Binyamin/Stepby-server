const express = require("express")
const router = express.Router()


// const userController = require("./user.control")
/**
   * @openapi
   * /all:
   *  get:
   *     tags:
   *     - all
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
router.use("/all", (req , res)=>{
    console.log("nehorai");
    res.send("Welcome")
})



module.exports= router