const tamplateService = require("./template.service");
const express = require("express");
const router = express.Router();
const { authJWT } = require('../auth/auth')


router.post('/createTemplate', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template'
    try {
        res.send(await tamplateService.createTemplate({ ...req.body, userId: req.user._id }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/createTemplateAdmin', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template by admin'
    try {
        res.send(await tamplateService.createTemplateAdmin({ ...req.body, userId: req.user._id }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateTemplate/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate template'
    try {
        res.send(await tamplateService.duplicateTemplate(req.params.templateId));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})
router.put('/newStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create step'
    try {
        res.send(await tamplateService.createStep({ ...req.body, templateId: req.params.templateId }));
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
        res.send(await tamplateService.deleteTemplate(req.params.templateId));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'delete step'
    try {
        res.send(await tamplateService.deleteStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/duplicateStep/:templateId', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate step'
    try {
        res.send(await tamplateService.duplicateStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/dataToStep/:templateId', authJWT, async (req, res) => {
    try {
        res.send(await tamplateService.dataToStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})
router.get('/templateByUser', authJWT, async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'get template by user'
    try {
        res.send(await tamplateService.templateByUser(req.user._id));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/categoriesByUser', authJWT, async (req, res) => {
    try {
        res.send(await tamplateService.categoriesByUser(req.user));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put("/downSteps/:templateId", authJWT, async (req, res) => {
    try {
        res.send(await tamplateService.downSteps({ templateId: req.params.templateId, stepIndex: req.body.stepIndex }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})



module.exports = router;
