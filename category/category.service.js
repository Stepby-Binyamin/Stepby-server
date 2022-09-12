const categoryModel = require('./category.model')

async function create(data){
    return await categoryModel.create(data)
}
async function read(filter){
    return await categoryModel.find(filter, proj)
}
async function readOne({_id}, proj){
    return await categoryModel.findOne({_id}, proj)
}
async function update(_id, newData){
    return await categoryModel.updateOne({_id}, newData)
}
async function del(data){
    return await categoryModel.deleteOne(data)
}

module.exports = { create, read, readOne, update, del }