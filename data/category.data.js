const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    
    categoryName: {
        type: String,
        required: true
    },
    isActive: {
        type:Boolean,
        default: false
    }
})

const categoryModel = mongoose.model('category', categorySchema)

module.exports = {categoryModel}