const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const templateRouter = require("../template/template.route")
const categoryRouter = require('../category/category.routes')
const languageRouter = require('../language/language.route')
const projectRoute = require('../template/project.route')


router.use("/user", userRouter)
router.use("/template", templateRouter)
router.use('/category', categoryRouter)
router.use('/language', languageRouter)
router.use('/project', projectRoute)

//shaul tests
// const shaulRouter = require("../test/shaul")
// router.use("/shaul", shaulRouter)
const filesRouter = require("../files/files.route")
router.use("/files", filesRouter)

module.exports = router