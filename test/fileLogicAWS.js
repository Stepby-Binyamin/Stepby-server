const fs = require("fs");

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})


async function createFile(fileName = "", dataContent = "", shortQuestion, data, enconding = "utf-8") {
    // console.log("fileLogic", fileName, dataContent, step, description, project);

    console.log("fileName", fileName);
    console.log("dataContent", dataContent);
    console.log("data", data);

    shortQuestion00 = JSON.parse(shortQuestion)
    // console.log("13", shortQuestion00);

    if (!fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}`)) {
        fs.mkdirSync(`${shortQuestion00.project}`)
        fs.mkdirSync(`${shortQuestion00.project}/${shortQuestion00.step}`)
    }

    if (fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}/description.txt`)) {
        // console.log("The File exists");
    }
    try {
        // Create
        let logs = []
        if (fs.existsSync(`${shortQuestion00.project}/${shortQuestion00.step}/description.txt`)) {
            logs = fs.readFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/description.txt`).toString().split("\n");
            shortQuestion = `\n${shortQuestion}`
            logs.push(shortQuestion)
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/description.txt`, `${logs}`)
        } else {
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/description.txt`, shortQuestion)
        }
        if (fileName) {
            fs.writeFileSync(`${shortQuestion00.project}/${shortQuestion00.step}/${fileName}`, dataContent, { enconding });
        }

        // const params = {
        //     Bucket: "NewName",
        //     CreateBucketConfiguration: {
        //         LocationConstraint: "eu-west-3",

        //     }
        // };
        // const newBucket = s3.createBucket(params, function (err, data) {
        //     if (err) console.log(err, err.stack);
        //     else console.log('Bucket Created Successfully', data.Location);
        // });

        // newBucket

        const blob = dataContent
        const uploadedFile = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: blob,
        }).promise()

        uploadedFile

        // console.log(uploadedImage.Location);

        return { filepath: `file created at ${shortQuestion00.project}/${shortQuestion00.step}/${fileName}`, uploadLocation: uploadedImage.Location };
    } catch (error) {
        return "Error from existFileCreate";
    }
}



module.exports = { createFile }