const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const categoryRouter = require('../category/category.routes')
const abc = require('../auth/temp')

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
router.use('/auth', abc)
router.use('/category', categoryRouter)



module.exports = router