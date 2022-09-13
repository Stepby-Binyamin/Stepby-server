const express = require("express");
const router = express.Router();
const projectService = require("./template.service");

router.get("/", (req, res) => {
    res.send("project");
});

//CreateProjectByTemplate
router.post("/createProject", async (req, res) => {
    try {
        res.send(await projectService.createTemplate(req.body));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
});
//replace steps
router.put("/replaceSteps", async (req, res) => {
    try {
        res.send(await projectService.replaceSteps(req.body));
    } catch (error) {
        console.log(error.message);
        res
            .status(error.code || 500)
            .send({ message: error.message || "something wrong :(" });
    }
})
//DeleteProject
router.delete("/deleteProject/:projectId", async (req, res) => {
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