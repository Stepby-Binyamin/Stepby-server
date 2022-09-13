const fs = require("fs");

const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
})


async function createFile(fileName = "", dataContent = "", step, description, project, shortQuestion, enconding = "utf-8") {
    // console.log("fileLogic", fileName, dataContent, step, description, project);
    console.log("13",shortQuestion);


    if (!fs.existsSync(`${project}/${step}`)) {
        fs.mkdirSync(`${project}`)
        fs.mkdirSync(`${project}/${step}`)
    }

    if (fs.existsSync(`${project}/${step}/description.txt`)) {
        console.log("The File exists");
    }
    try {
        // Create
        let logs = []
        if (fs.existsSync(`${project}/${step}/description.txt`)) {
            logs = fs.readFileSync(`${project}/${step}/description.txt`).toString().split("\n");
            shortQuestion = `\n${shortQuestion}`
            logs.push(shortQuestion)
            console.log(logs);
            fs.writeFileSync(`${project}/${step}/description.txt`, `${logs}`)
        } else {
            fs.writeFileSync(`${project}/${step}/description.txt`, shortQuestion)
        }
        if (fileName) {
            fs.writeFileSync(`${project}/${step}/${fileName}`, dataContent, { enconding });
        }

        // const fileContent = fs.readFileSync(`${project}/${step}/description.txt`)
        // const uploadTxt = await s3.upload({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: "description.txt",
        //     Body: fileContent,
        // }).promise()

        const blob = fs.readFileSync(`${project}/${step}/${fileName}`)
        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: blob,
        }).promise()

        uploadedImage
        // uploadTxt

        // console.log(uploadedImage.Location);

        return { filepath: `file created at ${project}/${step}/${fileName}`, uploadLocation: uploadedImage.Location };
    } catch (error) {
        return "Error from existFileCreate";
    }
}



module.exports = { createFile }