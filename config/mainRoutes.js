const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const templateRouter = require("../template/template.route")


router.use("/user", userRouter)
router.use("/template", templateRouter)

module.exports = router