const express = require("express");
const router = express.Router();
const projectService = require("./template.service");
const { authJWT}= require("../auth/auth");

router.get("/getStepById/:projectId/:stepId", authJWT, async(req, res)=>{
try {
    res.send(await projectService.getStepById(req.params.projectId, req.params.stepId));
} catch (error) {
    console.log(error.message);
    res
        .status(error.code || 500)
        .send({ message: error.message || "something wrong :(" });
}
});

router.post("/createProject/:templateId",authJWT ,async (req, res) => {
    // #swagger.tags = ['Projects']
    // #swagger.description = 'create project from template'
    try {
        res.send(await projectService.createProject({...req.body, user:req.user , templateId:req.params.templateId}));
    } catch (error) {
        console.log(error.message);
        res
        .status(error.code || 500)
        .send({ message: error.message || "something wrong :(" });
    }
});

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