const templateData = require('./template.model')
const userModel = require('../user/user.model');
const { Mongoose } = require('mongoose');

const createProject = async (data) => {
    const { userId, projectName, templateId, isNewClient, clientId } = data;
    if (!userId) throw { message: "userId is required" };
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
            creatorId: userId,
            name: projectName,
            isTemplate: false,
        });
    if (!isNewClient) {
        await templateData.update({ _id: newProject._id }, { client: clientId });
    }
    return "success"
}
const createTemplate = async ({ userId, templateName }) => {
    if (!templateName) throw { message: "error template name" };
    await templateData.create({ name: templateName, creatorId: userId, isTemplate: true })

    return ("ok")

}
const createTemplateAdmin = async ({ userId, templateName, isTemplate, radio, categories, phoneNumber }) => {
    if (!templateName) throw { message: "error template name" };
    if (radio) {
        await templateData.create({ name: templateName, creatorId: userId, categories, isTemplate })
    }
    else {
        const user = await userModel.readOne({ phoneNumber })
        if (!user) throw { message: "error - user phone doesn't exist" }
        await templateData.create({ name: templateName, creatorId: userId, client: user._id, isTemplate })
    }
    return ("ok")
}
const duplicateTemplate = async (templateId) => {
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
    await templateData.update({ _id: templateId }, { $push: { steps: [{ name: stepName, description, isCreatorApprove, index }] } })
    return "ok"

}
const dataToStep = async ({ templateId, stepId, owner, type, title, content, isRequired }) => {
    const step = await templateData.readOne({ _id: templateId, "steps._id": stepId }, { 'steps.$': 1 })
    const data = step.steps[0].data
    await templateData.update({ _id: templateId, "steps._id": stepId }, { $push: { "steps.$.data": [{ owner, type, title, content, isRequired, index: data.length }] } })

    return "ok"
}
const downSteps = async ({ templateId, stepIndex }) => {
    const stepsLenght = await templateData.readOne({ _id: templateId }, "steps")
    if (stepIndex < 0 || stepIndex >= stepsLenght.steps.length - 1) {
        throw { message: "error" }
    }
    await templateData.update({ _id: templateId, "steps.index": stepIndex }, { $set: { "steps.$.index": -1 } })
    await templateData.update({ _id: templateId, "steps.index": stepIndex + 1 }, { $set: { "steps.$.index": stepIndex } })
    await templateData.update({ _id: templateId, "steps.index": -1 }, { $set: { "steps.$.index": stepIndex + 1 } })
    return await templateData.readOne({ _id: templateId })
}
const templateByUser = async (userId) => {
    return await templateData.read({ isTemplate: true, creatorId: userId })
}
const projectByUser = async (userId) => {
    return await templateData.read({ isTemplate: false, creatorId: userId })

}
const categoriesByUser = async (user) => {
    const categories = user.categories[0].categories
    let templateByCategory = []

    for (i of categories) {
        templateByCategory = templateByCategory.concat(await templateData.read({ isTemplate: true, categories: { $in: i.toString() } }))
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

module.exports = { projectById, createTemplate, createProject, categoriesByUser, createTemplateAdmin, templateByUser, projectByUser, dataToStep, duplicateTemplate, deleteTemplate, createStep, downSteps, deleteStep, duplicateStep };