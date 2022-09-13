const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const templateRouter = require("../template/template.route")
const categoryRouter = require('../category/category.routes')
const languageRouter = require('../language/language.route')
const projectRoute = require('../template/project.route')
const abc = require('../auth/temp')


router.use("/user", userRouter)
router.use("/template", templateRouter)
router.use('/auth', abc)
router.use('/category', categoryRouter)
router.use('/language', languageRouter)
router.use('/project', projectRoute)



module.exports = router