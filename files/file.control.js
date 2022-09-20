const AWS = require('aws-sdk');
AWS.config.apiVersions = { s3: '2006-03-01', };
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})

// fucntion that create a bucket for a specific client , the client name nee to be lowercased, and anothers spcifications
// that need to be limited on the client side 
const createBucket = async (client) => {

    const params = {
        Bucket: "stepby-projects",
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
const createBiz = async (bizName) => {
    var params = {
        Bucket: "stepby-projects",
        Key: `${bizName}/`,
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
        Bucket: "stepby-projects",
        Key: `${client}/`,
    };

    return await s3.putObject(params).promise()
}



//function that create a project under a specific bucket (client)
// key is the path / folder name (the "/" is import - meant thats a folder)
// this function can be used to add a new step too further in the project, just configure 
// the projectName = projectnName/step#  
const createProject = async (bizName, projectName) => {
    var params = {
        Bucket: "stepbyprojects",
        Key: `${bizName}/${projectName}/`,
    };

    return await s3.putObject(params).promise()
}

//function that create all the project steps where will be filled with files along the project
const createSteps = async (bizName, projectName, stepName) => {

    var params = {
        Bucket: "stepbyprojects",
        Key: `${bizName}/${projectName}/${stepName}/`,
    };

    await s3.putObject(params).promise()
}

//function that upload jpg or pdf to specific path (Key)
const uploadFile = async (fileName, dataContent, objShortQuestion, data) => {

    // console.log("objShortQuestion2525", objShortQuestion);
    // console.log("data", data);

    const objShortQuestion00 = JSON.parse(objShortQuestion)
    const { client, projectName, stepNum, answer } = objShortQuestion00

    answer !== "" && uploadAnswer(objShortQuestion, fileAnswerName = "fileAnswerName")

    // console.log("11", client);
    // console.log("22", `${projectName}/${Number(stepNum)}/${fileName}`);
    // ${bizName}/${projectName}/${stepName}/
    const blob = dataContent
    const result = await s3.upload({
        Bucket: "stepby-projects",
        Key: `${client}/${projectName}/step${Number(stepNum)}/${fileName}`,
        Body: blob,
    }).promise()
    return result
}

//THIS FUNCTION NEED TO BE CHECKED, DOESNT WORK PROPERLY
const uploadAnswer = async (objShortQuestion, fileAnswerName = "answerName") => {
    // console.log("objShortQuestion", objShortQuestion);

    const objShortQuestion00 = JSON.parse(objShortQuestion)
    const { client, projectName, stepNum } = objShortQuestion00

    // console.log("111", client);
    // console.log("222", `${projectName}/step${Number(stepNum)}/${fileAnswerName}.txt`);

    return await s3.upload({
        Bucket: "stepby-projects",
        Key: `${client}/${projectName}/step${Number(stepNum)}/${fileAnswerName}.txt`,

        Body: objShortQuestion,
    }).promise()
}



// function used to download a file, PDF or Image
// Bucket is the main folder to look for the file<string>, Key is the path, inlcuding the filename <string> ex: my/path/is.jpg
// fileName including his extension
const getFile = async (client, projectName, stepNum, fileName) => {

    var params = {
        Bucket: "stepby-projects",
        Key: `${client}/${projectName}/step${Number(stepNum)}/${fileName}`
    };

    return await s3.getObject(params).promise()
}

//function that
const getShow = async (client, projectName, stepNum, fileName) => {

    var params = {
        Bucket: "stepby-projects",
        Key: `${client}/${projectName}/step${Number(stepNum)}/${fileName}`
    };

    return await s3.getObject(params).promise()
}

//function that give back a list of elements (file and/or folder) locaded in one specific bucket
// Bucket is the main folder <string>, Prefix is the folder inside Bucket <string>,
// StartAfter is the first returned list element<string>, MaxKey number of elements (can be till 1000 elements)<numbner>
const listFiles = async (bizName, projectName, stepName) => {
    console.log("listFiles",bizName, projectName, stepName);
    var params = {
        Bucket: "stepbyprojects",
        StartAfter: `${bizName}/${projectName}/`,    // start content from this point
        Prefix: `${bizName}/${projectName}/`,                   // contents to be shown
        MaxKeys: 50
    };
    return await s3.listObjectsV2(params).promise()
}

//Function that delete one element from the bucket
//Bucket <string>, Key is the path <string> <string> ex: my/path/is.pdf
const delFile = async ({ client, projectName, stepNum, fileName }) => {
    var params = {
        Bucket: "stepby-projects",
        Key: `${client}/${projectName}/${stepNum}/${fileName}`
    };
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);   // an error occurred
        else console.log(data);                 // successful response
    }).promise()
}

const copyFiles = async (bizName, projectName, stepName, newName) => {
    // console.log("PATH111", `/stepby-projects/${bizName}/${projectName}/${stepName}`);
    
    const list = await listFiles(bizName, projectName, stepName)
    // console.log("List111", list.Contents);
    
    // const projectNameCopy = projectName + "copy"
    
    newName !== "" ? projName = newName : projName = `${projectName}Copy`
    await createProject(bizName, projName)

    list.Contents.forEach(element => {

        const first = element.Key.indexOf("/")
        const second = element.Key.indexOf("/", first +1)
        const path = element.Key.slice(second)
        // console.log("path1212", path);

        var params = {
            Bucket: "stepbyprojects",
            CopySource: `/stepbyprojects/${element.Key}`,
            Key: `${bizName}/${projName}${path}`
        };
        return s3.copyObject(params).promise()
    });
}

module.exports = { createBucket, createBiz, createClient, createProject, createSteps, uploadFile, uploadAnswer, getFile, getShow, listFiles, delFile, copyFiles }