const { projectData } = require('../data/project.data')

async function create(data) {
    return await projectData.create(data);
}
async function read(filter, proj) {
    return await projectData.find({isActive: true,...filter }, proj).populate("client").populate({path: "creatorId"}).populate({path: "client"})
}
async function readOne(filter, proj) {
    return await projectData.findOne({isActive: true,...filter }, proj).populate("client").populate({path: "creatorId"}).populate({path: "client"});
}
async function update(filter, newData, options) {
    return await projectData.findOneAndUpdate(filter, newData, { ...options, new: true });
}
async function remove(filter) {
    return await update(filter, { isActive: false });
}
async function deleteAll(){
    await projectData.deleteMany({}).catch(function(err) {console.log(err);})
}
// deleteAll()
module.exports = { create, read, readOne, update, remove };