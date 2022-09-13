const { categoryModel } = require('../data/category.data')

async function create(data){
    return await categoryModel.create(data)
}
async function read(filter, proj){
    return await categoryModel.find(filter, proj)
}
async function readOne(filter, proj){
    return await categoryModel.findOne(filter, proj)
}
async function update(filter, newData){
    return await categoryModel.updateOne(filter, newData)
}
async function del(data){
    return await categoryModel.deleteOne(data)
}

module.exports = { create, read, readOne, update, del }