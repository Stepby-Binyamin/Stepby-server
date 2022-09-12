const { languageModel } = require('../data/language.data')

async function create(data){
    return await languageModel.create(data)
}
async function read(filter, proj){
    return await languageModel.find(filter, proj)
}
async function readOne(filter, proj){
    return await languageModel.findOne(filter, proj)
}
async function update(filter, newData){
    return await languageModel.updateOne(filter, newData)
}
async function del(data){
    return await languageModel.deleteOne(data)
}

module.exports = { create, read, readOne, update, del }