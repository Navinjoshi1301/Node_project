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
        url: "https://github.com/DesmondSanctity/node-js-swagger", // Ensure valid URL
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local server",
      },
      {
        url: process.env.LIVE_URL || "https://<your-live-domain.com>", // Set LIVE_URL environment variable or provide default
        description: "Live server",
      },
    ],
  },
  // Look for configuration in specified directories
  apis: ["./src/routes/user.routes.js"], // Assuming your API routes are in files starting with 'router'
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
  ); // Optional: Hide topbar for cleaner UI

  // Documentation in JSON format
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
