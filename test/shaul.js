
const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer()

const fileLogic = require("./fileLogicAWS")
const check = require("./libs/s3_getobject")

router.post('/files/upload', upload.single("new_file"), async (req, res) => {

    console.log("111", req.body);
    console.log("222", req.file);

    try {
        const { file, body } = req
        const result = await fileLogic.createFile(file?.originalname, file?.buffer, body.objShortQuestion, body?.data)

        console.log("333", result);
        res.status(200).send(result)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.get('/files/down', async (req, res) => {
    try {

        let result = await check.getFile();
        console.log("1212", result);
        res.attachment("lesson.pdf"); // Set Filename
        res.type(result.ContentType); // Set FileType

        // res.setHeader('Content-type', "application/octet-stream");
        // res.setHeader('content-type', "image/jpg");

        res.setHeader('content-disposition', 'attachment; filename=lesson.pdf');
        res.send(result.Body)

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

router.get('/files/list', async (req, res) => {
    try {
        let result = await check.listFiles();
        console.log("/files/list", result);


    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}
)

router.delete('/files/delete', async (req, res) => {
    try {
        await check.delFile()
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})


module.exports = router