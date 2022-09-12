const tamplateService = require("./template.service");

router.post('/createTemplate', async (req, res) => {
    try {
        res.send(await tamplateService.createTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/createTemplateAdmin', async (req, res) => {
    try {
        res.send(await tamplateService.createTemplateAdmin(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateTemplate', async (req, res) => {
    try {
        res.send(await tamplateService.duplicateTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete('/deleteTemplate', async (req, res) => {
    try {
        res.send(await tamplateService.deleteTemplate(req.body));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})