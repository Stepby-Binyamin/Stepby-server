const templateService = require("./template.service");
const express = require("express");
const router = express.Router();
const { authJWT } = require("../auth/auth");



router.get("/getStepById/:templateId/:stepId", authJWT, async (req, res) => {
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
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template'
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
        res.send(await templateService.createTemplateAdmin({ ...req.body, userId: req.user._id, permission: req.user.permission }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateTemplate/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate template'
    try {
        res.send(await templateService.duplicateTemplate(req.params.templateId));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})
router.put('/newStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create step'
    try {
        res.send(await templateService.createStep({ ...req.body, templateId: req.params.templateId }));
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
router.get('/templateByUser', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'get template by user'
    try {
        res.send(await templateService.templateByUser(req.user._id));

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

router.put("/downSteps/:templateId", authJWT, async (req, res) => {
    try {
        res.send(await templateService.downSteps({ templateId: req.params.templateId, stepIndex: req.body.stepIndex }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})
router.get('/templateById/:templateId', authJWT, async (req, res) => {
    try {
        res.send(await templateService.projectById(req.params.templateId));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})




module.exports = router;
