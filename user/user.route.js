const express = require('express');
const playlistLogic = require("../user/user.service");

const router = express.Router();



router.post('/register', async (res, req) => {
    try {
        await playlistLogic.register(res.body);
        req.send("new biz was created");
    } catch (error) {
        req.send(error.message);
    }
});

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
