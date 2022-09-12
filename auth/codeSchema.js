const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
     },
     code:{
        type: String,
         required: true
     },
     dateSent:{
         type: Date,
         required: true,
         default: Date.now()
     }
})


const codeModel = mongoose.model("code", codeSchema)
module.exports = {codeModel}