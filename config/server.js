require('dotenv').config({ path: "config/.env"})
const swaggerDocs =require("../swagger/swagger")
const logger = require("../logger/logger")
const mainRouter = require("./mainRoutes")
const Api404Error = require('../erorrHandle/api404Error')
const {logErrorMiddleware,returnError} = require ('../erorrHandle/errorHandler.js')

const express = require("express")
// const bodyParser = require("body-parser")

const cors = require("cors")
const { config } = require('process')

const app = express()

app.use(cors())
app.use(express.json())

PORT = process.env.PORT || 5001




app.use("/", mainRouter)

app.use(logErrorMiddleware)
app.use(returnError)

require("../data/db").connect()
const check =()=>{
    try{
        throw new Api404Error("hhh")//,user:req.user
    }catch(err){
        console.log(err)
        logger.error({e:err})
    }
    
}
check()


swaggerDocs(app, PORT)

app.listen(PORT, ()=> console.log(`Server is running at Port ${PORT}`))