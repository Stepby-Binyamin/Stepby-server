require('dotenv').config({ path: "config/.env"})
const swaggerDocs =require("../swagger/swagger")

const express = require("express")
// const bodyParser = require("body-parser")

const cors = require("cors")
const { config } = require('process')

const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 5001

const mainRouter = require("./mainRoutes")

app.use("/", mainRouter)

require("../data/db").connect()

swaggerDocs(app, PORT)

app.listen(PORT, ()=> console.log(`Server is running at Port ${PORT}`))