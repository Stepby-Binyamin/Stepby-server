const templateData = require('./template.model')
const userModel = require('../user/user.model');
const { Mongoose } = require('mongoose');
const { newClient } = require("../user/user.service");

const getStepById = async (projectId, stepId) => {
    const steps = await templateData.readOne({ _id: projectId, "steps._id": stepId }, { "steps.$": 1 })
    return steps.steps[0]
};


const createProject = async ({ user, projectName, templateId, isNewClient, clientId, fullName, phoneNumber, email }) => {
    if (!projectName) throw { message: "projectName is required" };
    if (!templateId) throw { message: "templateId is required" };
    if (isNewClient === undefined) throw { message: "isNewClient is required" };

    const dup = JSON.parse(JSON.stringify(await templateData.readOne({ _id: templateId }, "-_id")));
    // const duplicateTemplate= structuredClone(a)
    // console.log(duplicateTemplate);
    const newProject = await templateData.create(dup);
    console.log(newProject);

    await templateData.update({ _id: newProject._id },
        {
            creatorId: user._id,
            name: projectName,
            isTemplate: false,
            status: "new"
        });
    if (isNewClient) {
        const client = newClient({ fullName, phoneNumber, email }, user)
        await templateData.update({ _id: newProject._id }, { client: client._id });
    }
    else {
        await templateData.update({ _id: newProject._id }, { client: clientId });
    }
    return "success"
}

// createProject({user: {_id:"6321d710adc24fc6dffcd126" }, projectName: "good data", templateId:"6322c772f8d7d30ff3da0230", isNewClient: false, clientId:"6321d812adc554992c045f2d"})

const createTemplate = async ({ userId, templateName }) => {
    try {
        if (!templateName) throw { message: "error template name" };
        await templateData.create({ name: templateName, creatorId: userId, isTemplate: true })
    } catch (err) {
        console.log(err)
    }
    return ("ok")
}
// createTemplate({userId: "6322e6562e79794c3c19db36", templateName:"new templatefrom the admin 6"})

const renameTemplate = async ({ templateId, newName }) => {
    await templateData.update({ _id: templateId }, { $set: { name: newName } })
    return ("ok")
}

const doneProject = async (projectId) => {
    await templateData.update({ _id: projectId }, { $set: { status: "done" } })
    return ("ok")
}

const createTemplateAdmin = async ({ userId, permission, templateName, isTemplate, radio, categories, phoneNumber }) => {
    if (permission == 'admin') {
        if (!templateName) throw { message: "error template name" };
        if (radio) {
            await templateData.create({ name: templateName, creatorId: userId, categories, isTemplate })
        }
        else {
            const user = await userModel.readOne({ phoneNumber })
            if (!user) throw { message: "error - user phone doesn't exist" }
            await templateData.create({ name: templateName, creatorId: userId, client: user._id, isTemplate })
        }
    }
    else { throw { message: "user isn't admin" } }
    return ("ok")
}
const duplicateTemplate = async (templateId) => {
    //TODO: duplicate-second
    const template = JSON.parse(JSON.stringify(await templateData.readOne({ _id: templateId }, "-_id")))
    const newTemplate = await templateData.create(template)
    await templateData.update({ _id: newTemplate._id }, { name: `${newTemplate.name}עותק(1)` })
    return ("ok")
}
const deleteTemplate = async (templateId) => {
    await templateData.remove({ _id: templateId })
    return ("ok")
}
const deleteStep = async ({ stepId, templateId }) => {
    await templateData.update({ _id: templateId }, { $pull: { steps: { _id: stepId } } })
    return ("ok")
}
const duplicateStep = async ({ stepId, templateId }) => {
    //TODO: duplicate-second
    //TODO: step location
    const template = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const step = template.steps[0]
    createStep({ templateId, stepName: step.name + "עותק(1)", description: step.description, isCreatorApprove: step.isCreatorApprove })
    return ("ok")
}

const createStep = async ({ templateId, stepName, description, isCreatorApprove }) => {
    console.log(templateId, stepName, description, isCreatorApprove);
    if (!stepName) throw { message: "error step name" };
    if (!description) throw { message: "error description" };
    if (isCreatorApprove == undefined) throw { message: "error-approve" }
    const template = await templateData.readOne({ _id: templateId })
    if (!template) throw { message: "error-template" };
    const index = template.steps.length
    console.log({ name: stepName, description, isCreatorApprove, index });
    const project = await templateData.update({ _id: templateId }, { $push: { steps: [{ name: stepName, description, isCreatorApprove, index }] } })
    return project.steps;
}

const editStep = async ({ templateId, stepId, stepName, description, isCreatorApprove }) => {
    const template = templateData.readOne({_id: templateId});
    if(!template) throw new Error("template not exist"); 
    const res = await templateData.update(
        {_id: templateId},
        {$set: {"steps.$[el].name": stepName,"steps.$[el].description": description, "steps.$[el].isCreatorApprove" : isCreatorApprove } },
        { 
          arrayFilters: [{ "el._id": stepId }],
          new: true
        }
      )
      console.log('res: ', res);
    return res.steps;
}

const dataToStep = async ({ templateId, stepId, owner, type, title, content, isRequired }) => {
    const step = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const data = step.steps[0].data
    await templateData.update({ _id: templateId, "steps._id": stepId }, { $push: { "steps.$.data": [{ owner, type, title, content, isRequired, index: data.length }] } })

    return "ok"
}



const downSteps = async ({ templateId, stepIndex }) => {
    const stepsLength = await templateData.readOne({ _id: templateId }, "steps")
    if (stepIndex < 0 || stepIndex >= stepsLength.steps.length - 1) {
        throw { message: "error" }
    }
    await templateData.update({ _id: templateId, "steps.index": stepIndex }, { $set: { "steps.$.index": -1 } })
    await templateData.update({ _id: templateId, "steps.index": stepIndex + 1 }, { $set: { "steps.$.index": stepIndex } })
    await templateData.update({ _id: templateId, "steps.index": -1 }, { $set: { "steps.$.index": stepIndex + 1 } })
    return await templateData.readOne({ _id: templateId })
}
//TODO: 
const downWidget = async ({ templateId, stepIndex }) => {
    // const stepsLength = await templateData.readOne({ _id: templateId }, "steps")
    // if (stepIndex < 0 || stepIndex >= stepsLength.steps.length - 1) {
    //     throw { message: "error" }
    // }
    // await templateData.update({ _id: templateId, "steps.index": stepIndex }, { $set: { "steps.$.index": -1 } })
    // await templateData.update({ _id: templateId, "steps.index": stepIndex + 1 }, { $set: { "steps.$.index": stepIndex } })
    // await templateData.update({ _id: templateId, "steps.index": -1 }, { $set: { "steps.$.index": stepIndex + 1 } })
    // return await templateData.readOne({ _id: templateId })
}

const templateByUser = async (userId) => {
    return await templateData.read({ isTemplate: true, creatorId: userId })
}
const projectByUser = async (userId) => {
    return await templateData.read({ isTemplate: false, creatorId: userId })
}
const templateByCategoriesByUser = async (user) => {
    const categories = user.categories

    let templateByCategory = []
    const admins = await userModel.read({ permissions: "admin" }, "_id")
    for (i of admins) {
        for (i of categories) {
            templateByCategory = templateByCategory.concat(await templateData.read({ isTemplate: true, categories: { $in: i._id.toString() } }))
        }
    }

    let templateArr = []
    let flag = false
    for (i of templateByCategory) {
        for (j of templateArr) {
            if (i._id.toString() == j._id.toString()) {
                flag = true
            }
        }
        if (!flag) {
            templateArr.push(i)
        }
        flag = false
    }
    return templateArr
}

const projectById = async (projectId) => {
    return await templateData.readOne({ _id: projectId })

}


//לא גמור
const updateStep = async ({ templateId, stepId, dataId, content }) => {
    await templateData.update({ _id: templateId, "steps._id": stepId, "steps.$.data._id": dataId }, { $set: { "steps.$[s].data.$[d].content": content } }, { multi: true, arrayFilters: [{ "s._id": stepId }, { "d._id": dataId }] })

    return "ok"
}

const completeStep = async ({ projectId, stepId }) => {
    const step = await templateData.readOne({ _id: projectId, "steps._id": stepId }, { 'steps.$': 1 })
    const index = step.steps[0].index
    const nextStep = await templateData.readOne({ _id: projectId, "steps.index": index + 1 }, { 'steps.$': 1 })
    if (!nextStep) {
        console.log("done")
        return "ok"
    }
    const approve = nextStep.steps[0].isApprove
    await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": true, "steps.$.approvedDate": Date.now() } })
    if (approve) {
        await templateData.update({ _id: projectId }, { status: "biz" })
    }
    else {
        await templateData.update({ _id: projectId }, { status: "client" })
    }
    return "ok"
}

//לבדוק תאריך
const currentStep = async ({ projectId, stepId }) => {
    return await templateData.update({ _id: projectId, "steps._id": stepId }, { $set: { "steps.$.isApprove": false, "steps.$.approvedDate": undefined } })

}

module.exports = {
    currentStep, downWidget, doneProject, renameTemplate, projectById, projectByUser,
    createTemplate, createProject, templateByCategoriesByUser, createTemplateAdmin, templateByUser,
    dataToStep, duplicateTemplate, deleteTemplate, createStep, downSteps, deleteStep, duplicateStep,

     getStepById, updateStep, completeStep,editStep};


