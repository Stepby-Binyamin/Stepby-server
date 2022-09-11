const projectData = require('../data/project.data')

async function create(data) {
    return await projectData.create(data);
}
async function read(filter, proj) {
    return await projectData.find(filter, proj);
}
async function readOne(filter, proj) {
    return await projectData.findOne(filter, proj);
}
async function update(filter, newData) {
    return await projectData.findOneAndUpdate(filter, newData, { new: true });
}
async function deleteTemplate(filter) {
    return await update(filter, { isActive: false });
}

module.exports = { create, read, readOne, update, deleteTemplate };