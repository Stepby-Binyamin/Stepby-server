const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const templateRouter = require("../template/template.route")
const categoryRouter = require('../category/category.routes')
const languageRouter = require('../language/language.route')

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
router.use("/template", templateRouter)
router.use('/category', categoryRouter)
router.use('/language', languageRouter)



module.exports = router