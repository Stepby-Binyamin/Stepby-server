const { projectData } = require('../data/project.data')

async function create(data) {
    return await projectData.create(data);
}
async function read(filter, proj) {
    return await projectData.find(filter, proj).populate("client").populate({path: "creatorId"}).populate({path: "client"})
}
async function readOne(filter, proj) {
    return await projectData.findOne(filter, proj).populate("client");
}
async function update(filter, newData) {
    return await projectData.findOneAndUpdate(filter, newData, { new: true });
}
async function remove(filter) {
    return await update(filter, { isActive: false });
}

module.exports = { create, read, readOne, update, remove };