const templateData = require('./template.model')
const userModel = require('../user/user.model');
const { newClient } = require("../user/user.service");

const createTemplate = async ({ userId, templateName }) => {
    if (!templateName) throw { message: "error template name" };
    const template=await templateData.create({ name: templateName, creatorId: userId, isTemplate: true })
    return template._id
}
const createTemplateAdmin = async ({ userId, permission, templateName, isGeneral, categories, phoneNumber }) => {
    let project;
    const selectedCategories=categories.filter(category =>category.isActive===true);
    if (permission == 'admin') {
        if (!templateName) throw { message: "error template name" };
        if (isGeneral) {
            project = await templateData.create({ name: templateName, creatorId: userId, categories:selectedCategories, isTemplate:true })
        }
        else {
            const user = await userModel.readOne({ phoneNumber })
            if (!user) throw { message: "error - user phone doesn't exist" }
            project = await templateData.create({ name: templateName, creatorId: userId, client: user._id, isTemplate:true })
        }
    }
    else { throw { message: "user isn't admin" } }
    return ({ message: project })
}
const renameTemplate = async ({ templateId, newName }) => {
    await templateData.update({ _id: templateId }, { $set: { name: newName } })
    return ("ok")
}
const duplicateTemplate = async ({userId,templateId}) => {
    //TODO: duplicate-second
    const template = JSON.parse(JSON.stringify(await templateData.readOne({ _id: templateId }, "-_id")))
    const newTemplate = await templateData.create(template)
    const user = await userModel.readOne({ _id: userId })
    user.permissions === "admin"?
        await templateData.update({ _id: newTemplate._id }, { name: `${newTemplate.name}-עותק(1)` , creatorId : userId, lastApprove:Date.now()})
        :
        await templateData.update({ _id: newTemplate._id }, { name: `${newTemplate.name}-עותק(1)` , creatorId : userId, lastApprove:Date.now(),categories:[]})
    return newTemplate._id 
}
const templateByUser = async (userId) => {
    return await templateData.read({ isTemplate: true, creatorId: userId })
}
const deleteTemplate = async (templateId) => {
    await templateData.remove({ _id: templateId })
    return ("ok")
}
const templateByCategoriesByUser = async (user) => {
    const categories = user.categories
    let templatesByCategories = []
    const admins = await userModel.read({ permissions: "admin" }, "_id")
    for (i of admins) {
        for (i of categories) {
            templatesByCategories = templatesByCategories.concat(await templateData.read({ isTemplate: true, categories: { $in: i._id.toString() } }))
        }
    }
    let templatesToSubmit = []
    let flag = false
    for (i of templatesByCategories) {
        for (j of templatesToSubmit) {
            if (i._id.toString() == j._id.toString()) {
                flag = true
            }
        }
        if (!flag) {
            templatesToSubmit.push(i)
        }
        flag = false
    }
    return templatesToSubmit
}
const duplicateStep = async ({ stepId, templateId }) => {
    //TODO: duplicate-second
    //TODO: step location
    const template = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const step = template.steps[0]
    const steps= await createStep({ templateId, stepName: step.name + "עותק (1)"
                                    ,description: step.description, isCreatorApprove: step.isCreatorApprove })
    return steps[steps.length-1]._id
}


const createProject = async ({ user, projectName, templateId, isNewClient, clientId, fullName, phoneNumber, email }) => {
    if (!projectName) throw { message: "projectName is required" };
    if (!templateId) throw { message: "templateId is required" };
    if (isNewClient === undefined) throw { message: "isNewClient is required" };
    let client
    const dup = JSON.parse(JSON.stringify(await templateData.readOne({ _id: templateId }, "-_id")));
    // const duplicateTemplate= structuredClone(a)
    // console.log(duplicateTemplate);
    const newProject = await templateData.create(dup);
    if (isNewClient) {
        client = await newClient({ fullName, phoneNumber, email }, user)
    }
    await templateData.update({ _id: newProject._id },
        {
            creatorId: user._id,
            name: projectName,
            isTemplate: false,
            status: newProject.steps[0].isCreatorApprove? "biz" : "client",
            client: isNewClient? client._id : clientId
        });
    return newProject._id
}
const projectById = async (projectId) => {
    return await templateData.readOne({ _id: projectId })
}
const projectByUser = async (userId) => {
    return await templateData.read({ isTemplate: false, creatorId: userId })
}
const doneProject = async (projectId) => {
    return await templateData.update({ _id: projectId }, { $set: { status: "done" } })
}

const projectUpdate = async (projectId) => {
    const project = await templateData.readOne({ _id: projectId })
    console.log("🚀 ~ file: template.service.js:114 ~ projectUpdate ~ project", project.steps)
    let step={index:project.steps.length+1}
    for (let i = 0; i < project.steps.length; i++) {
        console.log("🚀 :", !project.steps[i].isApprove," 🚀 :",step.index>project.steps[i].index)
        if(!project.steps[i].isApprove && step.index>project.steps[i].index){
            step=project.steps[i]
        }  
    }
    console.log("🚀 ~ file: template.service.js:117 ~ projectUpdate ~ step", step)
    await templateData.update({ _id: projectId }, { status: step.isCreatorApprove ? "biz" : "client" })
}
const getStepById = async (projectId, stepId) => {
    const template = await templateData.readOne({ _id: projectId, "steps._id": stepId })
    const step=template.steps.find(step => step._id.toString()===stepId)
    const nextStepName=template.steps.find(step_ => step_.index===step.index+1)?.name
    const isCurrent=step.index===[...template.steps].sort((a, b) => a.index < b.index ? -1 : 1).find(step_ => !step_.isApprove).index
    return { bizName: template.creatorId.firstName ,
             creatorIdPermissions:template.creatorId.permissions , 
             client: template.client,
             isCurrent, 
             nextStepName , 
             step , 
             tempName: template.name }
}
const deleteStep = async ({ stepId, templateId }) => {
    await templateData.update({ _id: templateId }, { $pull: { steps: { _id: stepId } } })
    await projectUpdate(templateId)
    return ("ok")
}
const createStep = async ({ templateId, stepName, description, isCreatorApprove }) => {
    if (!stepName) throw { message: "error step name" };
    if (!description) throw { message: "error description" };
    if (isCreatorApprove == undefined) throw { message: "error-approve" }

    const template = await templateData.readOne({ _id: templateId })
    if (!template) throw { message: "error-template" };
    
    let index;
    if(!template.steps.length){
        index = 0
    }
    else{
        index = template.steps[0].index
        for (let i = 1; i < template.steps.length; i++) {
            if(template.steps[i].index>index)
                index = template.steps[i].index
        }
        index++
    }
    const project = await templateData.update({ _id: templateId }, { $push: { steps: [{ name: stepName, description, isCreatorApprove, index }] } })
    return project.steps;
}
const editStep = async ({ templateId, stepId, stepName, description, isCreatorApprove }) => {
    const template = templateData.readOne({ _id: templateId });
    if (!template) throw new Error("template not exist");
    const res = await templateData.update(
        { _id: templateId },
        { $set: { "steps.$[el].name": stepName, "steps.$[el].description": description, "steps.$[el].isCreatorApprove": isCreatorApprove } },
        {
            arrayFilters: [{ "el._id": stepId }],
            new: true
        }
    )
    return res.steps.filter(v => v._id == stepId)[0];
}
const dataToStep = async ({ templateId, stepId, owner, type, title, content, isRequired }) => {
    // console.log({ templateId, stepId, owner, type, title, content, isRequired });
    const step = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const data = step.steps[0].data
    const res = await templateData.update({ _id: templateId, "steps._id": stepId }, { $push: { "steps.$.data": [{ owner, type, title, content, isRequired, index: data.length }] } })
    return res.steps.filter(v => v._id == stepId)[0];
}
const replaceSteps =async ({templateId, stepId1,stepId2})=>{
    const template = await templateData.readOne({ _id: templateId }, "steps")
    const index1=template.steps.find(step => step._id.toString() === stepId1).index
    const index2=template.steps.find(step => step._id.toString() === stepId2).index
    await templateData.update({ _id: templateId, "steps._id": stepId1 }, { $set: { "steps.$.index": index2 } })
    await templateData.update({ _id: templateId, "steps._id": stepId2 }, { $set: { "steps.$.index": index1 } })
    if(!template.isTemplate){
        await projectUpdate(templateId)
    }
    return await templateData.readOne({ _id: templateId })
}
const updateStep = async ({ templateId, stepId, dataId, content }) => {
    //לא גמור
    await templateData.update({ _id: templateId, "steps._id": stepId, "steps.$.data._id": dataId },
             { $set: { "steps.$[s].data.$[d].content": content } }, { multi: true, arrayFilters: [{ "s._id": stepId }, { "d._id": dataId }] })
    return "ok"
}
const completeStep = async ({ projectId, stepId }) => {
    await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": true, "steps.$.approvedDate": Date.now() } })
    const nextStep_= await templateData.readOne({ _id: projectId, "steps.isApprove": false }, { 'steps.$': 1 })
    if (!nextStep_) {
        return doneProject(projectId)
    }
    nextStep_.steps[0].isCreatorApprove ?
        await templateData.update({ _id: projectId }, { status: "biz" })
         :
        await templateData.update({ _id: projectId }, { status: "client" });
    return "ok"
}
const currentStep = async ({ projectId, stepId }) => {
    //TODO check date 
    return await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": false, "steps.$.approvedDate": undefined } })

}

const addWidget = async ({ templateId,stepId,owner,type, title,content,isRequired }) => {
    if (!type) throw { message: "error- widget type" };
    if (!owner) throw { message: "error- owner " };

    const project=await templateData.update({_id: templateId, "steps._id": stepId},{$push:{"steps.$[s].data":{owner,type, title,content,isRequired}}},  { multi: true, arrayFilters: [{ "s._id": stepId }] })
    // console.log("🚀 ~ file: template.service.js:209 ~ addWidget ~ project", project)
    return project
}

module.exports = {
    currentStep, doneProject, renameTemplate, projectById, projectByUser,
    createTemplate, createProject, templateByCategoriesByUser, createTemplateAdmin, templateByUser,
    dataToStep, duplicateTemplate, deleteTemplate, createStep, replaceSteps, deleteStep, duplicateStep,
    updateStep, completeStep, editStep, getStepById,addWidget
};


