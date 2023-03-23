const express = require('express');
const router = express.Router();
// const { authJWT } = require('../auth/auth');
const multer = require("multer");
const upload = multer()
const filesControl = require("./file.control");

router.post('/create-biz', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:22 ~ router.post ~ create-biz")
        // console.log("🚀 ~ file: files.route.js:22 ~ router.post ~create-biz ~ req.body",  req.body)
        const client = req.body.firstName + req.body.lastName
        const result = await filesControl.createBiz( req.body._id.toString())
        // console.log("🚀 ~ file: files.route.js:15 ~ router.post ~ result", result)
        
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
    try {
        console.log("🚀 ~ file: files.route.js:82 ~ router.post ~ upload-file ~ req.body", req.body)
        console.log("🚀 ~ file: files.route.js:82 ~ router.post ~ upload-file ~ req.file", req.file)

        const result = await filesControl.uploadFile(req.file,req.body.data)
        console.log("🚀 ~ file: files.route.js:70 ~ router.post ~ result", result)

        res.status(200).send(result)
    } catch (err) {
        console.log("🚀 ~ file: files.route.js:73 ~ router.post ~ err", err)
        res.status(400).send(err);
    }
})
router.post("/upload-answer", upload.single("new_file"), async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:105 ~ router.post ~ upload-answer")

        const result = await filesControl.uploadAnswer(req.body)
        console.log("🚀 ~ file: files.route.js:95 ~ router.post ~ result", result)

        res.status(200).send(result)
    } catch (err) {
        console.log("🚀 ~ file: files.route.js:86 ~ router.post ~ err", err)
        res.status(400).send(err);
    }
})
router.post('/download', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:121 ~ router.post ~ download")
        const result = await filesControl.getFile(req.body);
    
        res.attachment("lesson.pdf"); // Set Filename
        res.type(result.ContentType); // Set FileType
        res.setHeader('content-disposition', 'attachment; filename=lesson.pdf');
        // result.pipe(res)

        res.send(result.Body)
    } catch (err) {
        console.log("🚀 ~ file: files.route.js:118 ~ router.post ~ err", err)
        res.status(400).send(err);
    }
})
router.post('/showImg', async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:139 ~ router.post ~ showImg")
        let data = await filesControl.getShow(req.body);
        console.log("🚀 ~ file: files.route.js:126 ~ router.post ~ data", data)
        
        let buf = Buffer.from(data.Body);

        let base64 = buf.toString('base64');

        res.send(base64)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})
router.post("/copy-files", async (req, res) => {
    try {
        console.log("🚀 ~ file: files.route.js:136 ~ router.post ~ copy-files")

        const result = await filesControl.copyFiles("6322e6562e79794c3c19db36","64175fdf0d6beeb33a7cb6a0")
        console.log("🚀 ~ file: files.route.js:126 ~ router.post ~ result", result)
        res.status(200).send(result)
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