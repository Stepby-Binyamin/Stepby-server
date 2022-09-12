require('../data/db').connect();

const {userData} = require('../data/user.data');

async function create(data){
    return await userData.create(data);
 }
 async function read(filter,proj){
    return await userData.find(filter,proj);
 }
 async function readOne(filter,proj){
    return await userData.findOne(filter,proj);
 }
 async function update(filter,newData){
    return await userData.updateOne(filter, newData);
 }
 async function del(filter){
   return await update(filter,{"$set":{"isActive":false}});
}

 module.exports = {create,read,update,del,readOne};

