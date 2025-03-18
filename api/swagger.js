const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Babyfoot",
      version: "1.0.0",
      description: "La documentation de l'API de l'application de gestion de tournois de Babyfoot",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",  
          },
        },
      },
      security: [
        {
          BearerAuth: [], 
        },
      ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
