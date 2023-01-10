const fs = require("fs");

const AWS = require('aws-sdk');

AWS.config.apiVersions = {
    s3: '2006-03-01',
    // other service API versions
};

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})
AWS.config.update({ region: 'eu-west-3' });

async function createFile(fileName = "", dataContent = "", shortQuestion, data, enconding = "utf-8") {
    // console.log("fileLogic", fileName, dataContent, step, description, project);

    console.log("fileName", fileName);
    console.log("dataContent", dataContent);
    console.log("shortQuestion", shortQuestion);
    console.log("data", data);

    const description = "description.pdf"
    const shortQuestion00 = JSON.parse(shortQuestion)
    const { step, project } = shortQuestion00
    const client = "shaulattie2"
    console.log(project, step, client);

    const BUCKET_NAME = shortQuestion00.project.toLowerCase()
    // console.log("13", shortQuestion00);

    if (!fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}`)) {
        fs.mkdirSync(`${shortQuestion00.project}`)
        fs.mkdirSync(`${shortQuestion00.project}/${shortQuestion00.step}`)
    }

    if (fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`)) {
        // console.log("The File exists");
    }
    try {
        // Create
        let logs = []
        if (fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`)) {
            logs = fs.readFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`).toString().split("\n");
            shortQuestion = `\n${shortQuestion}`
            logs.push(shortQuestion)
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`, `${logs}`)
        } else {
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`, shortQuestion)
        }
        if (fileName) {
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${fileName}`, dataContent, { enconding });
        }
        ////////////

        // const params = {
        //     Bucket: client.toLowerCase(),
        //     ACL: "private",
        //     CreateBucketConfiguration: {
        //         // Set your region here
        //         LocationConstraint: "eu-west-3"
        //     },
        // };

        // await s3.createBucket(params, function (err, data) {
        //     if (err) console.log(err, err.stack);
        //     else {
        //         console.log('Bucket Created Successfully', data.Location)
        //     };
        // })

        ///////////////////////////////////////////
        // var paramsput = {
        //     Bucket: client.toLowerCase(),
        //     Key: `saco/`,
        // };

        // await s3.putObject(paramsput, function (err, data) {
        //     if (err) console.log(err, err.stack);
        //     else {
        //         console.log('Project Created Successfully')
        //         return
        //     };
        // })

        ///////////////////////////////////////////
        // for (i = 1; i < 10; i++) {

        //     var paramsput = {
        //         Bucket: client.toLowerCase(),
        //         Key: `saco/step${i}/`,
        //     };

        //     await s3.putObject(paramsput, function (err, data) {
        //         if (err) console.log(err, err.stack);
        //         else {
        //             console.log('Folder Created Successfully', data)
        //             return
        //         };
        //     })
        // }
        ///////////////////////
        // const blobtest = dataContent
        // await s3.upload({
        //     Bucket: client.toLowerCase(),
        //     Key: `saco/step1/${fileName}`,
        //     Body: blobtest,
        // })
        // ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // //create new bucket
        // const params = {
        //     Bucket: BUCKET_NAME,
        //     CreateBucketConfiguration: {
        //         // Set your region here
        //         LocationConstraint: "eu-west-3"
        //     },
        // };

        // const newBucket = s3.createBucket(params, function (err, data) {
        //     if (err) console.log(err, err.stack);
        //     else {
        //         console.log('Bucket Created Successfully', data.Location)
        //         return
        //     };
        // })

        // newBucket
        // ////////////////////////////////
        // // add folder inside bucket that already exists
        // var paramsput = {
        //     Bucket: "stepby",
        //     Key: "mykey/"
        // };

        // const addFolder = s3.putObject(paramsput).promise();

        // addFolder
        // ///////////////////////
        const blob = dataContent
        const uploadedFile = await s3.upload({
            Bucket: client.toLowerCase(),
            Key: `saco/step1/${fileName}`,
            // Bucket: process.env.AWS_S3_BUCKET_NAME,
            // Key: fileName,

            Body: blob,
        }).promise()

        uploadedFile

        // /////////////////////////
        const blobAnswer = fs.readFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${description}`)
        const uploadedPdfAnswer = await s3.upload({
            Bucket: client.toLowerCase(),
            Key: `saco/step1/${description}`,
            // Bucket: process.env.AWS_S3_BUCKET_NAME,
            // Key: description,

            Body: blobAnswer,
        }).promise()

        uploadedPdfAnswer

        console.log("uploadedFile.Location", uploadedFile.Location);

        return {
            filepath: `file created at ${shortQuestion00.project}/${shortQuestion00.step}/${fileName}`,
            uploadLocation: uploadedFile.Location,
            uploadedPdfAnswer: uploadedPdfAnswer.Location
        };
    } catch (error) {
        return "Error from existFileCreate";
    }
}

module.exports = { createFile }