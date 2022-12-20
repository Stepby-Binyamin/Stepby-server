const categoryControl = require('./category.model')

async function create(data){
    if (!data)
        throw {code: 400, message: "missing category name" };
    const exist = await categoryControl.readOne(data)
    if(exist) 
        throw({code: 405, message: "category already exists"});
    const category = await categoryControl.create(data)
    return category;
}

async function read(){
    const category = await categoryControl.read({});
    if (!category) 
        throw({ code: 404, message: "categories not found" });
    return category;
}

async function readOne(_id, proj){
    if (!_id)
        throw {code: 400, message: "ID not provided" };
    const category = await categoryControl.readOne({_id}, proj)
    if (!category) 
        throw({ code: 404, message: "category not found" });
    return category;
}

async function update(_id, newData){
    if (!_id)
        throw {code: 400, message: "ID not provided" };
    if (!newData)
        throw {code: 400, message: "no new data provided" };
    const findCategory = await categoryControl.readOne({_id})
    if (!findCategory) 
        throw({ code: 404, message: "category not found" });
    const category = await categoryControl.update({_id}, newData)
    return category;
}

async function del(_id){
    if (!_id)
        throw {code: 400, message: "ID not provided" };
    const exist = await categoryControl.readOne({_id})
    if(!exist) 
        throw({code: 404, message: "category not found" });
    const category = await categoryControl.del({_id})
    return category;
}

module.exports = { create, read, readOne, update, del }