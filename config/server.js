require('dotenv').config({ path: "config/.env"})

const express = require("express")
// const bodyParser = require("body-parser")

const cors = require("cors")
const { config } = require('process')

const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 5000

const mainRouter = require("./mainRoutes")
app.use("/", mainRouter)

require("../data/db").connect()

app.listen(PORT, ()=> console.log(`Server is running at Port ${PORT}`))