const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route.js")

/**
   * @openapi
   * /user:
   *  get:
   *     tags:
   *     - user
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
router.use("/user", userRouter)



module.exports = router