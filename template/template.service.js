const templateData = require('./template.model')
const userModel = require('../user/user.model');
const { newClient } = require("../user/user.service");

const createTemplate = async ({ userId, templateName }) => {
    if (!templateName) throw { message: "error template name" };
    const template=await templateData.create({ name: templateName, creatorId: userId, isTemplate: true })
    return template._id
}
const createTemplateAdmin = async ({ userId, permission, templateName, isGeneral, categories, phoneNumber }) => {
    console.log("🚀 ~ file: template.service.js ~ line 11 ~ createTemplateAdmin ~ categories", categories)
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
    console.log("🚀 ~ file: template.service.js:50 ~ templateByCategoriesByUser ~ admins", admins)
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
    console.log("🚀 ~ file: template.service.js:69 ~ templateByCategoriesByUser ~ templateArr", templatesToSubmit)
    return templatesToSubmit
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


const getStepById = async (projectId, stepId) => {
    const template = await templateData.readOne({ _id: projectId, "steps._id": stepId })
    const step=template.steps.find(step => step._id.toString()===stepId)
    const nextStepName=template.steps.find(step_ => step_.index===step.index+1)?.name
    const isCurrent=step.index===[...template.steps].sort((a, b) => a.index < b.index ? -1 : 1).find(step_ => !step_.isApprove).index
    return {bizName: template.creatorId.firstName , client: template.client,isCurrent, nextStepName , step , tempName: template.name}
};
const deleteStep = async ({ stepId, templateId }) => {
    await templateData.update({ _id: templateId }, { $pull: { steps: { _id: stepId } } })
    return ("ok")
}
const duplicateStep = async ({ stepId, templateId }) => {
    //TODO: duplicate-second
    //TODO: step location
    const template = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    console.log("🚀 ~ file: template.service.js ~ line 128 ~ duplicateStep ~ template", template)
    const step = template.steps[0]
    console.log("🚀 ~ file: template.service.js ~ line 130 ~ duplicateStep ~ step", step)
    const steps= await createStep({ templateId, stepName: step.name + "עותק(1)"
                                    ,description: step.description, isCreatorApprove: step.isCreatorApprove })
    console.log("🚀 ~ file: template.service.js ~ line 133 ~ duplicateStep ~ steps", steps)
    console.log("🚀 ~ file: template.service.js ~ line 131 ~ duplicateStep ~ steps", steps)
    return steps[steps.length-1]._id
}
const createStep = async ({ templateId, stepName, description, isCreatorApprove }) => {
    if (!stepName) throw { message: "error step name" };
    if (!description) throw { message: "error description" };
    if (isCreatorApprove == undefined) throw { message: "error-approve" }
    const template = await templateData.readOne({ _id: templateId })
    if (!template) throw { message: "error-template" };
    const index = template.steps.length
    // console.log({ name: stepName, description, isCreatorApprove, index });
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
    // console.log('res: ', res);
    return res.steps.filter(v => v._id == stepId)[0];
}
const dataToStep = async ({ templateId, stepId, owner, type, title, content, isRequired }) => {
    // console.log({ templateId, stepId, owner, type, title, content, isRequired });
    const step = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const data = step.steps[0].data
    const res = await templateData.update({ _id: templateId, "steps._id": stepId }, { $push: { "steps.$.data": [{ owner, type, title, content, isRequired, index: data.length }] } })
    return res.steps.filter(v => v._id == stepId)[0];
}
const downSteps = async ({ templateId, stepIndex }) => {
    const template = await templateData.readOne({ _id: templateId }, "steps")
    if (stepIndex < 0 || stepIndex >= template.steps.length - 1) {
        throw { message: "error" }
    }
   
    await templateData.update({ _id: templateId, "steps.index": stepIndex }, { $set: { "steps.$.index": -1 } })
    await templateData.update({ _id: templateId, "steps.index": stepIndex + 1 }, { $set: { "steps.$.index": stepIndex }})
    const project=await templateData.update({ _id: templateId, "steps.index": -1 }, { $set: { "steps.$.index": stepIndex + 1 } })
    
    if(!project.isTemplate && stepIndex===0){
         project.steps.find(step=>step.index===0).isCreatorApprove ?
            await templateData.update({ _id: templateId }, { status: "biz" })
            :
            await templateData.update({ _id: templateId }, { status: "client" });
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
    //לבדוק תאריך
    return await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": false, "steps.$.approvedDate": undefined } })

}


const addWidget = async ({ templateId,stepId,owner,type, title,content,isRequired }) => {
    if (!type) throw { message: "error- widget type" };
    if (!owner) throw { message: "error- owner " };

    const project=await templateData.update({_id: templateId, "steps._id": stepId},{$push:{"steps.$[s].data":{owner,type, title,content,isRequired}}},  { multi: true, arrayFilters: [{ "s._id": stepId }] })
    console.log("🚀 ~ file: template.service.js:209 ~ addWidget ~ project", project)
    return project
}
const downWidget = async ({ templateId, stepIndex }) => {
    //TODO: 
    // const stepsLength = await templateData.readOne({ _id: templateId }, "steps")
    // if (stepIndex < 0 || stepIndex >= stepsLength.steps.length - 1) {
    //     throw { message: "error" }
    // }
    // await templateData.update({ _id: templateId, "steps.index": stepIndex }, { $set: { "steps.$.index": -1 } })
    // await templateData.update({ _id: templateId, "steps.index": stepIndex + 1 }, { $set: { "steps.$.index": stepIndex } })
    // await templateData.update({ _id: templateId, "steps.index": -1 }, { $set: { "steps.$.index": stepIndex + 1 } })
    // return await templateData.readOne({ _id: templateId })
}

module.exports = {
    currentStep, downWidget, doneProject, renameTemplate, projectById, projectByUser,
    createTemplate, createProject, templateByCategoriesByUser, createTemplateAdmin, templateByUser,
    dataToStep, duplicateTemplate, deleteTemplate, createStep, downSteps, deleteStep, duplicateStep,
    updateStep, completeStep, editStep, getStepById,addWidget
};


