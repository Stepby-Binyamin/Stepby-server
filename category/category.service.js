const categoryControl = require('./category.model')

async function create(data){
    const category = await categoryControl.create(data)
    return category;
}
async function read(){
    const category = await categoryControl.read({});
    return category;
}
async function readOne(_id, proj){
    const category = await categoryControl.readOne({_id}, proj)
    return category;
}
async function update(_id, newData){
    const category = await categoryControl.update({_id}, newData)
    return category;
}
async function del(_id){
    const category = await categoryControl.del({_id})
    return category;
}

module.exports = { create, read, readOne, update, del }