const templateData = require('./template.model')

const createTemplate = async (userId, templateName, isTemplate) => {
    if (!userId) throw { message: "user undefind" };
    if (!templateName) throw { message: "error template name" };
    await templateData.create({ name: templateName }, { creatorID: userId }, { isTemplate })
    return ("ok")
}

const createTemplateAdmin = async (userId, templateName, isTemplate, radio, categories, phoneNumber) => {
    if (!userId) throw { message: "user undefind" };
    if (!templateName) throw { message: "error template name" };
    if (radio) {
        await templateData.create({ name: templateName }, { creatorID: userId }, { categories }, { isTemplate })
    }
    else {
        const user = await userModel.readOne(phoneNumber)
        if (!user) throw { message: "error - user phone doesn't exist" }
        await templateData.create({ name: templateName }, { creatorID: userId }, { client: user }, { isTemplate })
    }
    return ("ok")
}
const duplicateTemplate = async (userId, templateName, isTemplate) => {
    //איך לשכפל את התבנית?
    if (!userId) throw { message: "user undefind" };
    if (!templateName) throw { message: "error template name" };
    await templateData.create({ name: `${templateName}עותק(1)` }, { creatorID: userId }, { isTemplate })
    return ("ok")
}

const deleteTemplate = async (idTemplate) => {
    await templateData.deleteTemplate({ _id: idTemplate })
    return ("ok")
}


module.exports = { createTemplate, createTemplateAdmin, duplicateTemplate, deleteTemplate };