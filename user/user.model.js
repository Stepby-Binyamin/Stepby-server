
const { userData } = require('../data/user.data');

async function create(data) {
   console.log("data11",data);
   return await userData.create(data);
}
async function read(filter, proj) {

   return await userData.find(filter, proj).populate({ path: 'clients'}).populate({ path: 'categories'});
}
async function readOne(filter, proj) {
   return await userData.findOne(filter, proj).populate({ path: 'clients'}).populate({ path: 'categories'});
}
async function update(filter, newData) {
   return await userData.updateOne(filter, newData);
}
async function del(filter) {
   return await update(filter, { "$set": { "isActive": false } });
}
async function deleteAll() {
   return await userData.deleteMany({_id:{$nin : ["632ae63713f39728402a6608", "6322e6562e79794c3c19db36", "6321d710adc24fc6dffcd126"]}}).catch(function(err) {console.log(err);})
}
// deleteAll()
module.exports = { create, read, update, del, readOne };


