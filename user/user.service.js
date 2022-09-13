require('../data/db').connect();
const jwt = require('../auth/jwt');
const { sendSMS, verifyCode } = require('../auth/verification');

const userModel = require('./user.model');

const verify = async (data) => {
    const { phoneNumber, code } = data;
    if (!phoneNumber || !code) throw new Error('error');
    return verifyCode(data);
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


//TODO: need a token
const login = async (data) => {
    const { phoneNumber } = data;
    if (!phoneNumber) throw new Error("missing data");

    const phone = await userModel.readOne({ phoneNumber });
    if (!phone) throw new Error("phone number dosen't exist");

}

const newClient = async (data) => {
    const { fullName, phoneNumber, email } = data;
    if (!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({ fullName, phoneNumber, email, permissions: "client" });
    return client;
}


//TODO: check category not duplicate
const editBiz = async (data) => {
    
    const { firstName, lastName, businessName, categories } = data;
    if (!firstName || !lastName || !businessName || !categories) throw new Error("missing data");
    const foundUser = await userModel.read({ _id: data.id });
    if (!foundUser) throw new Error("error");
    const updatedUser = await userModel.update({ _id: data.id }, data, { new: true });
    const formatedUser = { firstName: updatedUser.firstName, lastName: updatedUser.lastName, businessName: updatedUser.businessName, categories: updatedUser.categories }
    return formatedUser;
}


const removeBiz = async (id) => {
    console.log("delete");
    const deleted = await userModel.del({ _id: id._id });
    return deleted;
}


//only for admin
const getAllBiz = async () => {
    const allBiz = await userModel.read({ permissions: "biz" });
    if (!allBiz) throw new Error("error occured");
    return allBiz;
}

const getAllClientsByBiz = async (data) => {
    const { _id } = data;


}

module.exports = { register, login, newClient, editBiz, removeBiz, getAllBiz, sms, verify };
