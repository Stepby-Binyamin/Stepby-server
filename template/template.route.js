const tamplateService = require("./template.service");
const express = require("express");
const router = express.Router();


router.post('/createTemplate', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template'
    try {
        res.send(await tamplateService.createTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/createTemplateAdmin', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create template by admin'
    try {
        res.send(await tamplateService.createTemplateAdmin(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateTemplate', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate template'
    try {
        res.send(await tamplateService.duplicateTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})
router.put('/newStep', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'create step'
    try {
        res.send(await tamplateService.createStep(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteTemplate', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'delete template'
    //  #swagger.parameters['id'] = { description: 'Some description...' }

    try {
        res.send(await tamplateService.deleteTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteStep', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'delete step'
    try {
        res.send(await tamplateService.deleteStep(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateStep', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'duplicate step'
    try {
        res.send(await tamplateService.duplicateStep(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/templateByUser/:userId', async (req, res) => {
    // #swagger.tags = ['Templates']
    // #swagger.description = 'get temolate by user'
    try {
        console.log(req.params.userId);
        res.send(await tamplateService.templateByUser(req.params.userId));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/categoriesByUser/:userId', async (req, res) => {
    try {
        // console.log(req.params.userId);
        res.send(await tamplateService.categoriesByUser(req.params.userId));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put("/downSteps/:templateId", async (req, res) => {
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
