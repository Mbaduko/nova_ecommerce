import swaggerJSDoc from 'swagger-jsdoc';

const swaggerConfig = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info:{
            title: "Ecommerce backend API documentation",
            version: "1.0.0",
            desccription: "This is the API documentation for the Ecommercre backend application"
        },
        servers:[
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ]
    },
    apis:['index.js']
})


export default swaggerConfig;