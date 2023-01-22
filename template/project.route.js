const express = require("express");
const router = express.Router();
const projectService = require("./template.service");
const { authJWT } = require("../auth/auth");


router.get('/projectsByUser', authJWT, async (req, res) => {
    console.log("🚀 ~ file: project.route.js:22 ~ router.get ~ projectsByUser")
    // #swagger.tags = ['Templates']
    // #swagger.description = 'get project by user'
    try {
        const result = await projectService.projectsByUser(req.user._id)
        res.send(result);

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get('/projectById/:projectId', authJWT, async (req, res) => {
    try {
        res.send(await projectService.projectById(req.params.projectId));

    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.get("/getStepById/:projectId/:stepId", authJWT, async (req, res) => {
    try {
        res.send(await projectService.getStepById(req.params.projectId, req.params.stepId));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
});

router.put('/doneProject/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'done project'
    try {
        res.send(await projectService.doneProject(req.params.projectId))
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
}) 

router.put('/renameProject/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'rename project'
    try {
        res.send(await projectService.renameTemplate({ ...req.body, templateId: req.params.projectId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post("/createProject/:templateId", authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'create project from template'
    try {
        res.send(await projectService.createProject({ ...req.body, user: req.user, templateId: req.params.templateId }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
});

router.put('/newStep/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'create step'
    try {
        const res = await projectService.createStep({ ...req.body, templateId: req.params.projectId });
        console.log('res:', res);
        res.send(res);
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);
    }
})

router.put('/duplicateStep/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'duplicate step'
    try {
        res.send(await projectService.duplicateStep({ ...req.body, templateId: req.params.projectId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.post('/duplicateProject/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'duplicate project'
    try {
        res.send(await projectService.duplicateTemplate(req.params.projectId));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);
    }
})

router.put("/replaceSteps", async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'change index of steps'
    try {
        res.send(await projectService.replaceSteps(req.body));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})

router.put('/dataToStep/:projectId', authJWT, async (req, res) => {
    try {
        res.send(await projectService.dataToStep({ ...req.body, templateId: req.params.projectId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put('/updateStep/:templateId', authJWT, async (req, res) => {
    try {
        res.send(await projectService.updateStep({ ...req.body, templateId: req.params.templateId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.put("/currentStep/:projectId", authJWT, async (req, res) => {
    try {
        res.send(await projectService.currentStep({ projectId: req.params.projectId, stepId: req.body.stepId }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})

router.put("/completeStep/:projectId", authJWT, async (req, res) => {
    console.log("🚀 ~ file: project.route.js:162 ~ router.put ~ completeStep", req.params.projectId, req.body)
    try {
        res.send(await projectService.completeStep({ projectId: req.params.projectId, stepId: req.body.stepId }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})
router.put("/stepUndo/:projectId", authJWT, async (req, res) => {
    console.log("stepUndo:", req.params.projectId, req.body);
    try {
        res.send(await projectService.stepUndo({ projectId: req.params.projectId, stepId: req.body.stepId }));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})

router.delete('/deleteStep/:projectId', authJWT, async (req, res) => {
    // #swagger.tags = ['Project']
    // #swagger.description = 'delete step'
    try {
        res.send(await projectService.deleteStep({ ...req.body, templateId: req.params.projectId }));
    } catch (error) {
        res.status(401).send("error");
        console.log(error.message);

    }
})

router.delete("/deleteProject/:projectId", async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'delete project
    try {
        res.send(await projectService.deleteTemplate(req.params.projectId));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
});

module.exports = router;