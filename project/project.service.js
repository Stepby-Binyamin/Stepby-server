const projectData=require('./project.model')


const createProjectByTemplate=async(data)=>{
    const {userId,projectName,templateId,isNewClient,clientId}=data;
    if (!userId) throw {message:"userId is required"};
    if (!projectName) throw {message:"projectName is required"};
    if (!templateId) throw {message:"templateId is required"};
    if (isNewClient===undefined) throw {message:"isNewClient is required"};
    
    const newProject=await projectData.create(await projectData.readOne({_id: templateId}));
    await projectData.update({_id: newProject._id},
        {
            creatorId:userId,
            name:projectName,
            isTemplate:false,
        })

        
}

module.exports = {funcName};