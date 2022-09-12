const express = require("express")
const router = express.Router()

const userRouter = require("../user/user.route")

router.use("/user", userRouter)

const shaulRouter = require("../test/shaul")
router.use("/shaul", shaulRouter)

module.exports = router