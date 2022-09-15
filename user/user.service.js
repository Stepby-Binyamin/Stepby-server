<<<<<<< HEAD
require('../data/db').connect();
const jwt = require('../auth/jwt');
const {sendSMS, verifyCode} = require('../auth/verification');
=======
const jwt = require('../auth/jwt');
const { sendSMS, verifyCode } = require('../auth/verification');
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df

const userModel = require('./user.model');

const verify = async (data) => {
<<<<<<< HEAD
    const {phoneNumber, code} = data;
    if(!phoneNumber || !code) throw new Error('error');
    return verifyCode(data);
=======
    const { phoneNumber, code } = data;
    if (!phoneNumber || !code) throw new Error('error');
    const result = verifyCode(data);
    return result
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
}


const sms = async (data) => {
<<<<<<< HEAD
    const {phoneNumber} = data;
    if(!phoneNumber) throw new Error('error');
=======
    const { phoneNumber } = data;
    if (!phoneNumber) throw new Error('error');
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
    return sendSMS(phoneNumber);
}


<<<<<<< HEAD
//TODO: need a token
const register = async (data) => {
    console.log(data);
    const { phoneNumber, firstName, lastName, email, bizName, categories } = data; // categories is array of _id
    //create a function that push each empty var into array.
    if (!phoneNumber || !firstName || !lastName || !email || !bizName) throw new Error("missing data:" + []);
    const newBiz = await userModel.create({ phoneNumber, firstName, lastName, email, bizName, categories, permissions: "biz" });
    // await userModel.update({_id: newBiz},{$push: {categories: categories}}) 
=======
const register = async (data) => {
    const { phoneNumber, firstName, lastName, email, bizName, categories } = data; // categories is array of _id
    //TODO: create a function that push each empty var into array.
    if (!phoneNumber || !firstName || !lastName || !email || !bizName) throw new Error("missing data:" + []);
    const newBiz = await userModel.create({ phoneNumber, firstName, lastName, email, bizName, categories, permissions: "biz" });
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
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

<<<<<<< HEAD
const newClient = async (data) => {
    const { fullName, phoneNumber, email } = data;
    if (!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({ fullName, phoneNumber, email, permissions: "client" });
=======
const newClient = async (data, user) => {
    const { fullName, phoneNumber, email } = data;
    if (!fullName || !phoneNumber || !email) throw new Error("missing data");
    const client = await userModel.create({ fullName, phoneNumber, email, permissions: "client" });
    await userModel.update({ _id: user._id, permissions: "biz" }, { $push: { clients: client } });
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
    return client;
}


<<<<<<< HEAD
const editBiz = async (data) => {
    const { firstName, lastName, businessName, categories } = data;
    if (!firstName || !lastName || !businessName, !categories) throw new Error("missing data");
    await userModel.read({ _id: data._id }); // TODO: 
    const biz = await userModel.update({ _id: data._id }, data);
    console.log("biz: ", biz);
    return biz;
}


const removeBiz = async (id) => {
    console.log("delete");
    const deleted = await userModel.del({ _id: id._id });
=======
const editBiz = async (data, user) => {
    // const { firstName, lastName, bizName, categories } = data;
    const foundUser = await userModel.read({ _id: user._id, permissions: "biz" });
    if (!foundUser) throw new Error("user not found");
    const acknowledged = await userModel.update({ _id: foundUser._id, permissions: "biz" }, data, { new: true });
    return acknowledged;
}

const removeBiz = async (data, user) => {
    const foundUser = await userModel.read({ _id: user._id });
    if (!foundUser) throw new Error("user not found");
    const deleted = await userModel.del({ _id: user._id });
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
    return deleted;
}


//only for admin
const getAllBiz = async () => {
<<<<<<< HEAD
    const allBiz = await userModel.read({});
=======
    const allBiz = await userModel.read({ permissions: "biz" });
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
    if (!allBiz) throw new Error("error occured");
    return allBiz;
}

<<<<<<< HEAD

module.exports = { register, login, newClient, editBiz, removeBiz, getAllBiz,sms,verify };
=======
const getAllClientsByBiz = async (user) => {
    const clients = await userModel.readOne({ _id: user._id, permissions: "biz" });
    console.log(clients.clients);
    return clients.clients;
}



module.exports = { register, login, newClient, editBiz, removeBiz, getAllBiz, sms, verify, getAllClientsByBiz };
>>>>>>> 5f0dd4dc2873b09a88aeca84a41d99f7096fe2df
