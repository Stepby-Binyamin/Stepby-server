const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")
const abc = require('../auth/temp')
router.use("/user", userRouter)
router.use('/auth', abc)

module.exports = router