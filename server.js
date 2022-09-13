require('dotenv').config({ path: "config/.env"})
const swaggerFile =require("./swagger/swaggerOutput.json"),
swaggerUi = require("swagger-ui-express")

const express = require("express")
// const bodyParser = require("body-parser")

const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 5001

const mainRouter = require("./config/mainRoutes")
app.use("/", mainRouter)

require("./data/db").connect()

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.listen(PORT, ()=> console.log(`Server is running at Port ${PORT}`))