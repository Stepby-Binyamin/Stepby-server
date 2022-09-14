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

const newClient = async (data, user) => {
    const { fullName, phoneNumber, email } = data;
    if (!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({ fullName, phoneNumber, email, permissions: "client" });
    await userModel.update({ _id: user._id }, { $push: { clients: client } });
    return client;
}


const editBiz = async (data, user) => {
    // const { firstName, lastName, bizName, categories } = data;
    const foundUser = await userModel.read({ _id: user._id, permissions: "biz" });
    console.log("foundUser: ", foundUser);
    if (!foundUser) throw new Error("user not found");
    const acknowledged = await userModel.update({ _id: user._id, permissions: "biz" }, data, { new: true });
    return acknowledged;
}

const removeBiz = async (data, user) => {
    console.log("delete");
    const foundUser = await userModel.read({ _id: user._id });
    if (!foundUser) throw new Error("user not found");
    const deleted = await userModel.del({ _id: user._id });
    return deleted;
}


//only for admin
const getAllBiz = async () => {
    const allBiz = await userModel.read({ permissions: "biz" });
    if (!allBiz) throw new Error("error occured");
    return allBiz;
}

const getAllClientsByBiz = async (user) => {
    const clients = await userModel.readOne({ _id: user._id, permissions: "biz" });
    console.log(clients.clients);
    return clients.clients;
}



module.exports = { register, login, newClient, editBiz, removeBiz, getAllBiz, sms, verify, getAllClientsByBiz };