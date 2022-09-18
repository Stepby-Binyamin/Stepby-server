const jwt = require('../auth/jwt');
const { sendSMS, verifyCode } = require('../auth/verification');
const { categoryModel } = require('../data/category.data');

const userModel = require('./user.model');

const verify = async (data) => {
    const { phoneNumber, code } = data;
    if (!phoneNumber || !code) throw new Error('error');
    const result = verifyCode(data);
    return result
}

const verifyBeforeSMS = async (token, data) => {
    const { phoneNumber } = data;
    token = token.split(" ")[1];
    let verifyToken, result, activeUser;
    try {
        verifyToken = await jwt.validateToken(token)
    } catch (err) {
        console.log(33333, err);
    } finally {

        if (!verifyToken) {
            console.log('lo tov')
            return 401
        }
        activeUser = await userModel.readOne({ _id: verifyToken._id });
        if (activeUser.phoneNumber !== phoneNumber) return 401
        result = activeUser ? activeUser : 401
        return result
    }
}

const sms = async (data) => {
    const { phoneNumber } = data;
    if (!phoneNumber) throw new Error('error');
    return sendSMS(phoneNumber);
}


const register = async (data) => {
    const { phoneNumber, firstName, lastName, email, bizName, categories } = data; // categories is array of _id
    //TODO: create a function that push each empty var into array.
    if (!phoneNumber || !firstName || !lastName || !email || !bizName) throw new Error("missing data:" + []);
    const newBiz = await userModel.create({ phoneNumber, firstName, lastName, email, bizName, categories, permissions: "biz" });
    const token = jwt.createToken(newBiz);
    return token;
}

const createAdmin = async (data) => {
    const { phoneNumber, firstName, lastName, email } = data;
    if (!phoneNumber || !firstName || !lastName || !email) throw new Error("missing data");
    const newBiz = await userModel.create({ phoneNumber, firstName, lastName, email, permissions: "admin" });
    const token = jwt.createToken(newBiz);
    return token;
}
// createAdmin({ phoneNumber: "0525381648", firstName:"doron" , lastName: "admin", email: "admin@dd"}) //createted admin
//TODO: need a token
const login = async (data) => {
    const { phoneNumber } = data;
    if (!phoneNumber) throw new Error("missing data");

    const phone = await userModel.readOne({ phoneNumber });
    if (!phone) throw new Error("phone number dosen't exist");

}

const newClient = async (data, user) => {
    const { fullName, phoneNumber, email } = data;
    if (!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({ fullName, phoneNumber, email, permissions: "client" });
    await userModel.update({ _id: user._id, permissions: "biz" }, { $push: { clients: client } });
    return client;
}

const getAllCategories = async ()=>{
    const result = await categoryModel.find({})
    return result
}

const editCategories = async (data, user) => {
    console.log('start');
    const categories = data.map(async cat => await categoryModel.find({ categoryName: cat }))
    if (categories === []) throw { status: 404, message: 'bad request 112' }
    categories.map(async cat => await userModel.update({ _id: user._id, permissions: "biz" }, { $push: { categories: cat._id } }))
    console.log('done');
}




const editBiz = async (data, user) => {
    if(data.categories){
        await editCategories(data, user)
        console.log('ok');
    } else {
    const acknowledged = await userModel.update({ _id: user._id, permissions: "biz" }, data);
    console.log(11, acknowledged);
    }
    const result = await userModel.readOne({ _id: user._id, permissions: "biz" });
    return result
}


const removeBiz = async (data, user) => {
    const foundUser = await userModel.read({ _id: user._id });
    if (!foundUser) throw new Error("user not found");
    const deleted = await userModel.del({ _id: user._id });
    return deleted;
}


//only for admin
const getAllBiz = async (user) => {
    if (user.permissions == "admin") {
        const allBiz = await userModel.read({ permissions: "biz" });
        if (!allBiz) throw new Error("error occured");
        return allBiz;
    }
    throw new Error("Access Denied!")
}

const getAllClientsByBiz = async (user) => {
    const clients = await userModel.readOne({ _id: user._id, permissions: "biz" });
    console.log(clients.clients);
    return clients.clients;
}


// TODO: For development purposes only, delete before the production
const loginToUser = async ({ id }) => {
    const token = await jwt.createToken(id);
    let user = await userModel.readOne({ _id: id });
    return {
        user,
        token
    };
}

module.exports = { loginToUser, register, login, newClient, editBiz, removeBiz, getAllBiz, sms, verify, getAllClientsByBiz, verifyBeforeSMS, getAllCategories };