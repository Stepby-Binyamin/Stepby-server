const templateService = require('../template/template.service');
const AWS = require('aws-sdk');
AWS.config.apiVersions = { s3: '2006-03-01', };
const s3 = new AWS.S3({
    region:process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})
const BUCKET_NAME=process.env.AWS_BUCKET_NAME

// function that create a bucket for a specific client, the client name nee to be lowercased, and anothers spcifications
// that need to be limited on the client side 
const createBucket = async (client) => {
    const params = {
        Bucket: BUCKET_NAME,
        // Bucket: client.toLowerCase(),
        ACL: "private",
        CreateBucketConfiguration: {
            // Set your region here
            LocationConstraint: "eu-west-3"
        },
    };
    return await s3.createBucket(params).promise()
}

//Create bizName Folder
const createBiz = async (bizId) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/`,
    };
    return await s3.putObject(params).promise()
}

//function that create a Client folder under "stepby-projects" bucket (client)
// key is the path / folder name (the "/" is import - meant thats a folder)
// this function can be used to add a new step too further in the project, just configure 
// the projectName = projectnName/step#  
const createClient = async (client) => {
    var params = {
        // Bucket: client.toLowerCase(),
        Bucket: BUCKET_NAME,
        Key: `${client}/`,
    };
    return await s3.putObject(params).promise()
}

//function that create a project under a specific bucket (client)
// key is the path / folder name (the "/" is import - meant thats a folder)
// this function can be used to add a new step too further in the project, just configure 
// the projectName = projectnName/step#  
const createProject = async (bizId, projectId) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/${projectId}/`,
    };
    return await s3.putObject(params).promise()
}

//function that create all the project steps where will be filled with files along the project
const createSteps = async (bizId, projectId, stepId) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/${projectId}/${stepId}/`,
    };
    return await s3.putObject(params).promise()
}

const createFolder=async (path)=>{
    console.log("🚀 ~ file: file.control.js:71 ~ createFolder ~ createFolder")
    console.log("🚀 ~ file: file.control.js:71 ~ createFolder ~ path", path)
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${path}/`,
    };
    return await s3.putObject(params).promise()
}

//function that upload jpg or pdf to specific path (Key)
const uploadFile = async (file, data) => {
    console.log("🚀 ~ file: file.control.js:72 ~ uploadFile ~ file", file)
    console.log("🚀 ~ file: file.control.js:72 ~ uploadFile ~ data", data)

    const data_ = JSON.parse(data)
    const {bizId , templateId , stepId ,owner,type, title,isRequired } = data_  
    if(file){
        const params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/${templateId}/${stepId}/${file.originalname}`,  
        Body: file.buffer,
        }
        await s3.upload(params).promise()
    }
    const template=await templateService.addWidget(templateId,stepId,owner,type, title,file?`${file.originalname}`:null,isRequired)
       
    return template.steps.find(step => step._id.toString()===stepId)
}
// const collectFile=async({templateId,stepId,owner,type, title,,isRequired})=>{
//     const template=await templateService.addWidget(templateId,stepId,owner,type, title,`${file.originalname}.pdf`,isRequired)

// }

//THIS FUNCTION NEED TO BE CHECKED, DOESNT WORK PROPERLY
const uploadAnswer = async ({templateId,stepId,owner,type,title,isRequired}) => {
    console.log("🚀 ~ file: file.control.js:94 ~ uploadAnswer ~ uploadAnswer")
    const template=await templateService.addWidget(templateId,stepId,owner,type, title,null,isRequired)
    return template.steps.find(step => step._id.toString()===stepId)
}



// function used to download a file, PDF or Image
// Bucket is the main folder to look for the file<string>, Key is the path, inlcuding the filename <string> ex: my/path/is.jpg
// fileName including his extension
const getFile = async ({bizId,templateId,stepId, fileName}) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/${templateId}/${stepId}/${fileName}`
    };
    return await s3.getObject(params).promise()
}

//function that
const getShow = async ({bizId,templateId,stepId, fileName}) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${bizId}/${templateId}/${stepId}/${fileName}`
    };
    return await s3.getObject(params).promise()
}

//function that give back a list of elements (file and/or folder) locaded in one specific bucket
// Bucket is the main folder <string>, Prefix is the folder inside Bucket <string>,
// StartAfter is the first returned list element<string>, MaxKey number of elements (can be till 1000 elements)<numbner>
const listFiles = async ( path) => {
    console.log("🚀 ~ file: file.control.js:130 ~ listFiles ~ listFiles")
    var params = {
        Bucket: BUCKET_NAME,
        StartAfter: `${path}/`,    // start content from this point
        Prefix: `${path}/`,                   // contents to be shown
        // MaxKeys: 50
    };
    const res=await s3.listObjectsV2(params).promise()
    return res
}

//Function that delete one element from the bucket
//Bucket <string>, Key is the path <string> <string> ex: my/path/is.pdf
const delFile = async ({ client, projectName, stepNum, fileName }) => {
    var params = {
        Bucket: BUCKET_NAME,
        Key: `${client}/${projectName}/${stepNum}/${fileName}`
    };
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);   // an error occurred
        else console.log(data);                 // successful response
    }).promise()
}

const copyFiles = async (oldPath,newPath ,isStep=false ) => {
    console.log("🚀 ~ file: file.control.js:154 ~ copyFiles ~ copyFiles")
    console.log("🚀 ~ file: file.control.js:163 ~ copyFiles ~ oldPath", oldPath)
    console.log("🚀 ~ file: file.control.js:163 ~ copyFiles ~ newPath", newPath)
    const list = await listFiles(oldPath)

    await createFolder(newPath)
    console.log("🚀 ~ file: file.control.js:165 ~ copyFiles ~ createFolder")
    list.Contents.forEach(element => {
        const first = element.Key.indexOf("/")
        const second = element.Key.indexOf("/", first + 1)
        const third = element.Key.indexOf("/", second + 1)
        const path = isStep ? element.Key.slice(third) : element.Key.slice(second)
    
        console.log("🚀 ~ file: file.control.js:175 ~ copyFiles ~ `${newPath}${path}`", `${newPath}${path}`)

        const params = {
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${element.Key}`,
            Key: `${newPath}${path}`
        };
        const res=s3.copyObject(params).promise()
        return res
    });
}

Object.assign(
    module.exports,
    {
        createBucket, createBiz, createClient, createProject, createSteps, uploadFile,
        uploadAnswer, getFile, getShow, listFiles, delFile, copyFiles
    },
);

// module.exports = { createBucket, createBiz, createClient, createProject, createSteps, uploadFile, uploadAnswer, getFile, getShow, listFiles, delFile, copyFiles }