const express = require('express');
const router = express.Router();

// const { authJWT } = require('../auth/auth');

const multer = require("multer");
const { log } = require('winston');
const upload = multer()

const filesControl = require("./file.control");


router.post('/createbucket', async (req, res) => {
    console.log('/files/createBucket111', req.body);
    try {
        const { body } = req
        const result = await filesControl.createBucket(body.client)

        console.log('/files/createBucket222', result);

        res.status(200).send(`The Bucket for lient ${body.client} was created at  ${result.Location}`)

    } catch (err) {
        console.log(err);
        res.status(400).send("error", err.message);
    }
})

router.post('/createproject', async (req, res) => {
    console.log('/files/createproject111', req.body);
    try {
        const { body } = req
        const result = await filesControl.createProject(body.client, body.projectName)

        console.log('/files/createProject222', result);

        res.status(200).send(`${body.client}'s project ${body.projectName} was created at  http://${body.client}.s3.amazonaws.com/${body.projectName}`)

    } catch (err) {
        console.log(err);
        res.status(400).send("error", err.message);
    }
})

router.post('/createsteps', async (req, res) => {
    console.log('/files/createSteps111', req.body);

    try {
        const { body } = req
        const result = await filesControl.createSteps(body.client, body.projectName, body.stepsNum)

        console.log('/files/createSteps222', result);

        res.status(200).send(`All ${body.stepsNum} steps has been created under http://${body.client}.s3.amazonaws.com/${body.projectName}/step..`)

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.post('/uploadfile', upload.single("new_file"), async (req, res) => {

    console.log("/files/uploadfile111", req.body);
    console.log("/files/uploadfile222", req.file);

    try {
        // { client, projectName, stepNum, fileName, dataContent }
        const { file, body } = req
        console.log("1515", body.objShortQuestion);
        const result = await filesControl.uploadFile(file?.originalname, file?.buffer, body.objShortQuestion, body?.data)

        console.log("/files/uploadfile333", result);

        res.status(200).send(`The File "${file?.originalname} was uploaded to ${result.Location}, 
        and the "fileAnswerName.txt" was uploaded to "https://solyattie.s3.amazonaws.com/fisrtProject/step1/fileAnswerName.txt"`)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.post("/uploadanswer", upload.single("new_file"), async (req, res) => {
    console.log("/files/uploadanswer111", req.body);

    try {
        const { body } = req
        const result = await filesControl.uploadAnswer(body.objShortQuestion)

        console.log("/files/uploadanswer333", result);

        res.status(200).send(`The File "answerName.txt" was uploaded to ${result.Location}`)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.post('/download', async (req, res) => {
    console.log("/files/down111", req.body);
    try {
        const { body } = req
        let result = await filesControl.getFile(body.client, body.projectName, body.stepNum, body.fileName);

        console.log("/files/down222", result);

        res.attachment("lesson.pdf"); // Set Filename
        res.type(result.ContentType); // Set FileType
        res.setHeader('content-disposition', 'attachment; filename=lesson.pdf');

        res.send(result.Body)


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})
router.post('/showImg', async (req, res) => {
    console.log("/files/down156", req.body);
    try {
        const { body } = req
        let data = await filesControl.getShow(body.client, body.projectName, body.stepNum, body.fileName);
console.log("156",data);
        let buf = Buffer.from(data.Body);

        let base64 = buf.toString('base64');

        res.send(base64)


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.get('/list', async (req, res) => {
    console.log('/files/list111', req.body);

    try {
        // { client, projectName, stepNum }
        let result = await filesControl.listFiles();

        console.log("/files/list222", result);


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}
)

router.delete('/delete', async (req, res) => {
    console.log('/files/delete111', req.body);

    try {
        // {client, projectName, stepNum, fileName}
        await filesControl.delFile()

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})


module.exports = router