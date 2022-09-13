require('dotenv').config({ path: "config/.env"})
// const swaggerDocs =require("./swagger/swagger")
const logger = require("./logger/logger")
const mainRouter = require("./config/mainRoutes")
const Api404Error = require('./erorrHandle/api404Error')
const {logErrorMiddleware,returnError} = require ('./erorrHandle/errorHandler.js')
const swaggerFile =require("./swagger/swaggerOutput.json"),
swaggerUi = require("swagger-ui-express")

const express = require("express")
// const bodyParser = require("body-parser")

const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 5001




app.use("/", mainRouter)



require("./data/db").connect()

app.use(logErrorMiddleware)
app.use(returnError)
const check =()=>{
    try{
        throw new Api404Error("hhh")//,user:req.user
    }catch(err){
        console.log(err)
        logger.error({e:err})
    }
    
}
check()


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.listen(PORT, ()=> console.log(`Server is running at Port ${PORT}`))