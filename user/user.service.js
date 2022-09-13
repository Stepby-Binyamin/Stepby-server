require('../data/db').connect();

const userModel = require('./user.model');

//TODO: need a token
const register = async (data)=> {
    console.log(data);
    const {phoneNumber,firstName, lastName, email, bizName } = data;
    if(!phoneNumber || !firstName || !lastName || !email || !bizName) throw new Error("missing data");
    const newBiz = await userModel.create(data);
    return newBiz;

    // //TODO: this is only a draft:
    // const categories = await categoryModel.read({name: categoryName}) // read categories
    // await userModel.update({_id: categoryId},{$push: {categories: categories}})
}


//TODO: need a token
const login = async (data) => {
    const {phoneNumber} = data;
    if(!phoneNumber) throw new Error("missing data");
    
    const phone = await userModel.readOne({phoneNumber});
    if(!phone) throw new Error("phone number dosen't exist");

}

const newClient = async (data)=> {
    const {fullName, phoneNumber, email} = data;
    if(!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({fullName, phoneNumber, email}) 
}

const editBiz = async (data) => {
    const {firstName, lastName, businessName } = data;
    if(!firstName || !lastName || !businessName) throw new Error("missing data");
    const biz = await userModel.read(data);
    console.log("biz: ", biz);
    return await userModel.update(data);
}

module.exports = {register, login, newClient, editBiz};
