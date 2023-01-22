const templateService = require("./template.service");
const express = require("express");
const router = express.Router();
const { authJWT } = require("../auth/auth");
const { Router } = require("express");

router.get("/test", (req, res)=>{
    res.send("success");
})

router.get("/getStepById/:templateId/:stepId",/*  authJWT, */ async (req, res) => {
    try {
        res.send(await templateService.getStepById(req.params.templateId, req.params.stepId));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
});

router.post('/createTemplate', authJWT, async (req, res) => {

    console.log("/createTemplate22", req);
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template'
    console.log("userId:", req.user)
    try {
        res.send(await templateService.createTemplate({ ...req.body, userId: req.user._id }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/createTemplateAdmin', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template by admin'
    try {
        res.send(await templateService.createTemplateAdmin({ ...req.body, userId: req.user._id, permission: req.user.permissions, phoneNumber: req.user.phoneNumber }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateTemplate/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate template'
    try {
        res.send(await templateService.duplicateTemplate({userId: req.user._id,templateId:req.params.templateId}));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/newStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create step'
    console.log("template/newStep/:projectId", req.body);

    try {
        res.send(await templateService.createStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/edit-step/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'edit step'
    try {
        const response = await templateService.editStep({ ...req.body, templateId: req.params.templateId });
        console.log('response: ', response);
        res.send(response);
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);
    }
})
router.put("/replaceSteps", async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'change index of steps'
    try {
        res.send(await templateService.replaceSteps(req.body));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})

router.put('/addWidget', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create step'
    console.log("template/addWidget :", req.body);

    try {
        res.send(await templateService.addWidget({ ...req.body}));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteTemplate/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'delete template'
    //  #swagger.parameters['id'] = { description: 'Some description...' }

    try {
        res.send(await templateService.deleteTemplate(req.params.templateId));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'delete step'
    try {
        res.send(await templateService.deleteStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/renameTemplate/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'rename template'
    try {
        res.send(await templateService.renameTemplate({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/duplicateStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate step'
    try {
        res.send(await templateService.duplicateStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/dataToStep/:templateId', authJWT, async (req, res) => {
    try {
        res.send(await templateService.dataToStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/templatesByUser', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'get template by user'
    try {
        res.send(await templateService.templatesByUser(req.user._id));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);
    }
})

router.get('/categoriesByUser', authJWT, async (req, res) => {
    try {
        res.send(await templateService.templateByCategoriesByUser(req.user));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/templateById/:templateId', /* authJWT, */ async (req, res) => {
    try {
        res.send(await templateService.projectById(req.params.templateId));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})


module.exports = router;
