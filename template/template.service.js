const templateData = require('./template.model')


const createTemplate = async ({ userId, templateName, isTemplate }) => {
    if (!userId) throw { message: "user undefind" };
    if (!templateName) throw { message: "error template name" };
    await templateData.create({ name: templateName, creatorId: userId, isTemplate })
    return ("ok")
}

const createTemplateAdmin = async ({ userId, templateName, isTemplate, radio, categories, phoneNumber }) => {
    if (!userId) throw { message: "user undefind" };
    if (!templateName) throw { message: "error template name" };
    if (radio) {
        await templateData.create({ name: templateName, creatorId: userId, categories, isTemplate })
    }
    else {
        const user = await userModel.readOne(phoneNumber)
        console.log(user);
        if (!user) throw { message: "error - user phone doesn't exist" }
        await templateData.create({ name: templateName, creatorId: userId, client: user._id, isTemplate })
    }
    return ("ok")
}
const duplicateTemplate = async ({ userId, templateId }) => {
    if (!userId) throw { message: "user undefind" };
    const template = await templateData.readOne({ _id: templateId })
    console.log(template);
    // const newTemplate = await templateData.create(template, template.isNew = true)
    // console.log("***", newTemplate);
    // const newTemplate = await templateData.create(await templateData.readOne({ _id: templateId }))

    // await templateData.update({ _id: newTemplate._id }, { name: `${newTemplate.name}עותק(1)` })
    return ("ok")
}

const deleteTemplate = async (idTemplate) => {
    await templateData.deleteTemplate({ _id: idTemplate })
    return ("ok")
}

const createStep = async (templateId, stepName, description, isCreatorApprove) => {
    if (!stepName) throw { message: "error step name" };
    if (!description) throw { message: "error step name" };
    if (isCreatorApprove == undefined) throw { message: "error-approve" }
    const template = await templateData.readOne({ _id: templateId })
    if (!template) throw { message: "error-template" };
    const steps = template.steps.filter(e => { e.isActive })
    const index = steps.lenght + 1

    await templateData.update({ _id: templateId }, { steps: [...template.steps, { name: stepName, description, isCreatorApprove, index }] })
    return ("ok")
}

module.exports = { createTemplate, createTemplateAdmin, duplicateTemplate, deleteTemplate, createStep };