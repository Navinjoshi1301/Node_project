import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "You Tube API",
      description:
        "API endpoints for a mini blog service documented on Swagger",
      contact: {
        name: "Desmond Obisi",
        email: "info@miniblog.com",
        url: "https://github.com/DesmondSanctity/node-js-swagger", 
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local server",
      },
      {
        url: process.env.LIVE_URL || "",
        description: "Live server",
      },
    ],
  },
  
  apis: ["./src/routes/user.routes.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page with error handling
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none; }",
    })
  ); 
  app.get("/docs.json", (req, res) => {
    if (!swaggerSpec) {
      return res
        .status(500)
        .json({ message: "Error generating Swagger documentation" });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
