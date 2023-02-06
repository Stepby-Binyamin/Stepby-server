const nodemailer = require('nodemailer');
const templateData = require('./template.model')
const userModel = require('../user/user.model');
const { newClient } = require("../user/user.service");

const createTemplate = async ({ userId, templateName }) => {
    console.log("🚀 ~ file: template.service.js:6 ~ createTemplate ")
    if (!templateName) throw { message: "error template name" };
    const template=await templateData.create({ name: templateName, creatorId: userId, isTemplate: true })
    return template._id
}
const createTemplateAdmin = async ({ userId, permission, templateName, isGeneral, categories, phoneNumber }) => {
    console.log("🚀 ~ file: template.service.js:12 ~ createTemplateAdmin")
    let project;
    const selectedCategories=categories.filter(category =>category.isActive===true);
    if (permission == 'admin') {
        if (!templateName) throw { message: "error template name" };
        if (isGeneral) {
            project = await templateData.create({ name: templateName, creatorId: userId, categories:selectedCategories, isTemplate:true })
        }
        else {
            const user = await userModel.readOne({ phoneNumber:phoneNumber })
            if (!user) throw { message: "error - user phone doesn't exist" }
            project = await templateData.create({ name: templateName, creatorId: user._id, client: user._id, isTemplate:true })
        }
    }
    else { 
        throw { message: "user isn't admin" } 
    }
    return project 
}
const renameTemplate = async ({ templateId, newName }) => {
    console.log("🚀 ~ file: template.service.js:28 ~ renameTemplate ")
    await templateData.update({ _id: templateId }, { $set: { name: newName } })
    return ("ok")
}
const duplicateTemplate = async ({userId,templateId}) => {
    console.log("🚀 ~ file: template.service.js:33 ~ duplicateTemplate ")
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
const templatesByUser = async (userId) => {
    console.log("🚀 ~ file: template.service.js:47 ~ templatesByUser ")
    return await templateData.read({ isTemplate: true, creatorId: userId })
}
const deleteTemplate = async (templateId) => {
    console.log("🚀 ~ file: template.service.js:46 ~ deleteTemplate")
    await templateData.remove({ _id: templateId })
    return ("ok")
}
const templateByCategoriesByUser = async (user) => {
    console.log("🚀 ~ file: template.service.js:56 ~ templateByCategoriesByUser ")
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
    console.log("🚀 ~ file: template.service.js:74 ~ duplicateStep ")
    //TODO: duplicate-second
    //TODO: step location
    const template = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const step = template.steps[0]
    const steps= await createStep({ templateId, stepName: step.name + "-עותק (1)"
                                    ,description: step.description, isCreatorApprove: step.isCreatorApprove })
    return steps[steps.length-1]._id
}


const createProject = async ({ user, projectName, templateId, isNewClient, clientId, fullName, phoneNumber, email }) => {
    console.log("🚀 ~ file: template.service.js:85 ~ createProject ")
    if (!projectName) throw { message: "projectName is required" };
    if (!templateId) throw { message: "templateId is required" };
    if (isNewClient === undefined) throw { message: "isNewClient is required" };
    let client
    const dup = JSON.parse(JSON.stringify(await templateData.readOne({ _id: templateId }, "-_id")));
    // const duplicateTemplate= structuredClone(a)
    // console.log(duplicateTemplate);
    const newProject = await templateData.create(dup);
    let currentStepIndex=100 //TODO
    for (let i = 0; i < newProject.steps.length; i++) {
        if(currentStepIndex>newProject.steps[i].index){
            currentStepIndex=newProject.steps[i].index
        }
    }
    if (isNewClient) {
        client = await newClient({ fullName, phoneNumber, email }, user)
    }
    await templateData.update({ _id: newProject._id },
        {
            creatorId: user._id,
            name: projectName,
            isTemplate: false,
            currentStepIndex: currentStepIndex,
            status: newProject.steps.find(step=>step.index===currentStepIndex).isCreatorApprove? "biz" : "client",
            client: isNewClient? client._id : clientId
        });
    return newProject._id
}
const projectById = async (projectId) => {
    console.log("🚀 ~ file: template.service.js:123 ~ projectById ")
    return await templateData.readOne({ _id: projectId })
}
const projectsByUser = async (userId) => {
    console.log("🚀 ~ file: template.service.js:127 ~ projectsByUser ")
    return await templateData.read({ isTemplate: false, creatorId: userId })
}
const doneProject = async (projectId) => {
    console.log("🚀 ~ file: template.service.js:120 ~ doneProject")
    return await templateData.update({ _id: projectId }, { $set: { status: "done", currentStepIndex : null } })
}

const projectUpdate = async (projectId) => {
    console.log("🚀 ~ file: template.service.js:124 ~ projectUpdate")
    const project = await templateData.readOne({ _id: projectId })
    if(project.steps.every(step => step.isApprove)){
        return await doneProject(projectId)
    }
    const steps=[...project.steps].sort((a, b) => a.index < b.index ? -1 : 1)
    console.log("🚀 ~ file: template.service.js:142 ~ projectUpdate ~ steps", steps)
    const currentStep = steps.find(step => !step.isApprove)
    console.log("🚀 ~ file: template.service.js:144 ~ projectUpdate ~ currentStep", currentStep)

    const res = await templateData.update({ _id: projectId },{ $set: { "steps.$[el].approvedDate": Date.now() }},{arrayFilters: [{ "el._id": currentStep._id }],new: true})

    const p= await templateData.update({ _id: projectId }, { currentStepIndex : currentStep.index , status: currentStep.isCreatorApprove ? "biz" : "client" })
    console.log("🚀 ~ file: template.service.js:159 ~ projectUpdate ~ p", p)
    return p
}
const getStepById = async (projectId, stepId) => {
    console.log("🚀 ~ file: template.service.js:161 ~ getStepById ")
    const template = await templateData.readOne({ _id: projectId})
    const stepById=template.steps.find(step => step._id.toString()===stepId)
    const sortedSteps= [...template.steps].sort((a, b) => a.index < b.index ? -1 : 1)
    const indexStepById=sortedSteps.findIndex(step => step._id.toString()===stepId)
    let nextStepName= indexStepById+1!==sortedSteps.length ? sortedSteps[indexStepById+1].name : null

    return { bizName: template.creatorId.firstName ,
             creatorIdPermissions:template.creatorId.permissions , 
             client: template.client,
             isCurrent:template.currentStepIndex===stepById?.index, 
             index: stepById?.index,
             nextStepName , 
             step: stepById , 
             tempName: template.name }
}
const deleteStep = async ({ stepId, templateId }) => {
    console.log("🚀 ~ file: template.service.js:179 ~ deleteStep ")
    const template=await templateData.update({ _id: templateId }, { $pull: { steps: { _id: stepId } } })
    console.log("🚀 ~ file: template.service.js:183 ~ deleteStep ~ template", template)
    if(!template.isTemplate){
        await projectUpdate(templateId)
    }
    return "ok"
}
const createStep = async ({ templateId, stepName, description, isCreatorApprove }) => {
    console.log("🚀 ~ file: template.service.js:172 ~ createStep")
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
    console.log("🚀 ~ file: template.service.js:195 ~ editStep")
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
    console.log("🚀 ~ file: template.service.js:223 ~ dataToStep ")
    // console.log({ templateId, stepId, owner, type, title, content, isRequired });
    const step = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const data = step.steps[0].data
    const res = await templateData.update({ _id: templateId, "steps._id": stepId }, { $push: { "steps.$.data": [{ owner, type, title, content, isRequired, index: data.length }] } })
    return res.steps.filter(v => v._id == stepId)[0];
}
const replaceSteps =async ({templateId, stepId1,stepId2})=>{
    console.log("🚀 ~ file: template.service.js:215 ~ replaceSteps")
    const template = await templateData.readOne({ _id: templateId })
    console.log("🚀 ~ file: template.service.js:235 ~ replaceSteps ~ template", template)
    const index1=template.steps.find(step => step._id.toString() === stepId1).index
    const index2=template.steps.find(step => step._id.toString() === stepId2).index
    await templateData.update({ _id: templateId, "steps._id": stepId1 }, { $set: { "steps.$.index": index2 } })
    await templateData.update({ _id: templateId, "steps._id": stepId2 }, { $set: { "steps.$.index": index1 } })
    console.log("🚀 ~ file: template.service.js:241 ~ replaceSteps ~ template.isTemplate", template.isTemplate)
    
    if(!template.isTemplate){
        await projectUpdate(templateId)
    }
    return await templateData.readOne({ _id: templateId })
}
const updateStep = async ({ templateId, stepId, dataId, content }) => {
    console.log("🚀 ~ file: template.service.js:235 ~ updateStep")
    //לא גמור
    await templateData.update({ _id: templateId, "steps._id": stepId, "steps.$.data._id": dataId },
             { $set: { "steps.$[s].data.$[d].content": content } }, { multi: true, arrayFilters: [{ "s._id": stepId }, { "d._id": dataId }] })
    return "ok"
}
const completeStep = async ({ projectId, stepId }) => {
    console.log("🚀 ~ file: template.service.js:233 ~ completeStep ")
    const project =await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": true, "steps.$.approvedDate": Date.now() } })
    if(project.currentStepIndex===project.steps.find(step => step._id.toString()===stepId).index){
        await projectUpdate(projectId)
    }
    //TODO send mail
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.MY_EMAIL,
    //       pass: process.env.MY_EMAIL_PASS
    //     }
    // });
    // console.log("🚀 ~ file: template.service.js:262 ~ completeStep ~ process.env.MY_EMAIL", process.env.MY_EMAIL)
    // console.log("🚀 ~ file: template.service.js:262 ~ completeStep ~ process.env.MY_EMAIL_PASS", process.env.MY_EMAIL_PASS)
      
    // const mailOptions = {
    //     from: process.env.MY_EMAIL,
    //     to: 'sagimaatuf@gmail.com',   //TODO 
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };
      
    //   transporter.sendMail(mailOptions, (error, info)=>{
    //     error?
    //       console.log("🚀 ~ file: template.service.js:273 ~ transporter.sendMail ~ error", error)
    //       :
    //       console.log('🚀Email sent: ' + info.response);
    //   });
    return "ok"
}
const stepUndo = async ({ projectId, stepId }) => {
    console.log("🚀 ~ file: template.service.js:238 ~ stepUndo")
    await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": false, "steps.$.approvedDate": Date.now() } })
    await projectUpdate(projectId)
    return "ok"
}
const currentStep = async ({ projectId, stepId }) => {
    console.log("🚀 ~ file: template.service.js:244 ~ currentStep ")
    const project = await templateData.readOne({ _id: projectId, "steps._id": stepId }, { 'steps.$': 1 })
    return await templateData.update({ _id: projectId }, { currentStepIndex : project.steps[0]?.index , status: project.steps[0]?.isCreatorApprove ? "biz" : "client" })

}

const addWidget = async ({ templateId,stepId,owner,type, title,content,isRequired }) => {
    console.log("🚀 ~ file: template.service.js:269 ~ addWidget ")
    if (!type) throw { message: "error- widget type" };
    if (!owner) throw { message: "error- owner " };

    const project=await templateData.update({_id: templateId, "steps._id": stepId},{$push:{"steps.$[s].data":{owner,type, title,content,isRequired}}},  { multi: true, arrayFilters: [{ "s._id": stepId }] })
    // console.log("🚀 ~ file: template.service.js:209 ~ addWidget ~ project", project)
    return project
}

module.exports = {
    currentStep, doneProject, renameTemplate, projectById, projectsByUser,
    createTemplate, createProject, templateByCategoriesByUser, createTemplateAdmin, templatesByUser,
    dataToStep, duplicateTemplate, deleteTemplate, createStep, replaceSteps, deleteStep, duplicateStep,
    updateStep, completeStep,stepUndo, editStep, getStepById,addWidget
};