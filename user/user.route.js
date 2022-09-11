// stam test by shaul, can be deleted

const express = require("express")
const router = express.Router()

const userController = require("./user.control")

router.get("/signin", userController.signin)
router.get("/signup", userController.signup)


module.exports = router