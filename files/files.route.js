const express = require('express');
const router = express.Router();
// const { authJWT } = require('../auth/auth');
const multer = require("multer");
const upload = multer()
const filesControl = require("./file.control");

router.post('/create-biz', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:22 ~ router.post ~create-biz ~ req.body",  req.body)
        const client = req.body.firstName + req.body.lastName
        const result = await filesControl.createBiz( req.body._id.toString())
        console.log("🚀 ~ file: files.route.js:15 ~ router.post ~ result", result)
        
        res.status(200).send(`The folder for client ${client} was created at  https://stepby-files.s3.eu-central-1.amazonaws.com/${req.body._id}/`)
    } catch (err) {
        console.log(err);
        res.status(400).send("error", err.message);
    }
})
router.post('/create-project', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:38 ~ router.post ~ create-project ~  req.body", req.body)
        const result = await filesControl.createProject(req.body.bizId, req.body.projectId)
        console.log("🚀 ~ file: files.route.js:28 ~ router.post ~ result", result)
        
        res.status(200).send(`bizId: ${req.body.bizId}, was created at https://stepby-files.s3.eu-central-1.amazonaws.com/${req.body.bizId}/${req.body.projectId}/`)
    } catch (err) {
        console.log(err);
        res.status(400).send("error", err.message);
    }
})
router.post('/create-steps', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:50 ~ router.post ~ create-steps -req.body", req.body)
        const result = await filesControl.createSteps(req.body.bizId, req.body.projectId, req.body.stepId)
        console.log("🚀 ~ file: files.route.js:39 ~ router.post ~ result", result)

        res.status(200).send(`All ${req.body.stepId} steps has been created under https://stepby-files.s3.eu-central-1.amazonaws.com/${req.body.bizId}/${req.body.projectId}/${req.body.stepId}/`)
    } catch (err) {
        console.log("🚀 ~ file: files.route.js:43 ~ router.post ~ err", err)
        res.status(400).send(err);
    }
})
router.post('/create-client', async (req, res) => {
    console.log('/files/create-Client111', req.body);
    try {
        const { body } = req
        const client = body.firstName + body.lastName + body._id
        console.log(client);
        const result = await filesControl.createClient(client)

        console.log('/files/createBucket222', result);

        res.status(200).send(`The folder for client ${client} was created at  http://stepby-projects.s3.amazonaws.com/${client}`)

    } catch (err) {
        console.log(err);
        res.status(400).send("error", err.message);
    }
})
router.post('/upload-file', upload.single("new_file"), async (req, res) => {

    console.log("/files/upload-file111", req.body);
    console.log("/files/upload-file222", req.file);

    try {
        // { client, projectName, stepNum, fileName, dataContent }
        const { file, body } = req
        console.log("1515", body.objShortQuestion);
        const result = await filesControl.uploadFile(file?.originalname, file?.buffer, body.objShortQuestion, body?.data)

        console.log("/files/upload-file333", result);

        res.status(200).send(`The File "${file?.originalname} was uploaded to ${result.Location}, 
        and the "fileAnswerName.txt" was uploaded to "https://solyattie.s3.amazonaws.com/fisrtProject/step1/fileAnswerName.txt"`)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})
router.post("/upload-answer", upload.single("new_file"), async (req, res) => {
    console.log("/files/upload-answer111", req.body);

    try {
        const { body } = req
        const result = await filesControl.uploadAnswer(body.objShortQuestion)

        console.log("/files/upload-answer333", result);

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
        console.log("156", data);
        let buf = Buffer.from(data.Body);

        let base64 = buf.toString('base64');

        res.send(base64)


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})
router.post("/copy-files", async (req, res) => {

    console.log('/files/copy-files111', req.body);

    const { body } = req
    const bizName = body.bizName + body._id

    try {
        const result = await filesControl.copyFiles(bizName, body.name, body.steps.name, body.newName)

        console.log('/files/copyfiles222', result);

        res.status(200).send(`All ${body.steps.name} steps has been created under http://stepby-projects.s3.amazonaws.com/${bizName}/${body.name}/${body.steps.name}`)


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

router.get('/list', async (req, res) => {
    console.log('/files/list111', req.body);
    try {
        // { client, projectName, stepNum }
        const { body } = req
        const bizName = body.bizName + body._id
        let result = await filesControl.listFiles(bizName, body.name, body.steps.name);

        console.log("/files/list222", result.Contents);

        res.send(result.Contents)
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