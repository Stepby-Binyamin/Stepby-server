const { Express, Request, Response } = require("express");
const swaggerJsdoc = require("swagger-jsdoc") ;
const swaggerUi = require("swagger-ui-express") ;
const { version } = require ("../package.json") ;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version,
    }
  },
  apis: ["/STEPBY-SERVER/user/user.route.js", "/STEPBY-SERVER/config/mainRoutes.js"]
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

module.exports =swaggerDocs;