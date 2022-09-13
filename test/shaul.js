// stam test by shaul, can be deleted

const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer()


const fileLogic = require("./fileLogicAWS")

router.post('/files/upload', upload.single("new_file"), async (req, res) => {

console.log("111",req.body.objShortQuestion);

    try {
        const { file, body } = req
        const result = await fileLogic.createFile(file?.originalname, file?.buffer, body.step, body.description, body.project, body.objShortQuestion)

        res.status(200).send(result)
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})


module.exports = router