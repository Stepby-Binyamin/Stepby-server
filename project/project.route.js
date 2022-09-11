const router = express.Router();
const projectService = require("./project.service")
router.get("/", (req, res) => {
    res.send("project");
  }
  );
  
  router.get("/", (req, res) => {
    res.send("project");
  });

  //create
  router.post("/createProjectByTemplate", (req, res) => {
    try {
      res.send(await projectService.createProjectByTemplate(req.body));
    } catch (error) {

    }
  })

module.exports = router;