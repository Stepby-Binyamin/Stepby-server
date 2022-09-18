
const { userData } = require('../data/user.data');

async function create(data) {
   console.log("data11",data);
   return await userData.create(data);
}
async function read(filter, proj) {
   return await userData.find(filter, proj).populate({ path: 'clients', select: ['fullName'] }).populate({ path: 'categories'});
}
async function readOne(filter, proj) {
   return await userData.findOne(filter, proj).populate({ path: 'clients', select: ['fullName'] }).populate({ path: 'categories'});
}
async function update(filter, newData) {
   return await userData.updateOne(filter, newData);
}
async function del(filter) {
   return await update(filter, { "$set": { "isActive": false } });
}

module.exports = { create, read, update, del, readOne };


