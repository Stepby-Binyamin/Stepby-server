const express = require('express');
const userService = require("../user/user.service");

const router = express.Router();



router.post('/register', async (res, req) => {
    try {
        await userService.register(res.body);
        req.send("new biz was created");
    } catch (error) {
        req.send(error.message);
    }
});

router.put('editbiz', async (res,req) => {
    try{
        await userService.editBiz(res.body);
    }catch(error){
        req.send(error.message);
    }
})



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
