const mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    short: {
        type: String,
    },
    img: {
        type: String,
    },
    dict:{
        type: Object
    }
})
const languageModel = mongoose.model('language', languageSchema)
module.exports = {languageModel}
