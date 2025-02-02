import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptioner = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevU API Documentation',
      version: '1.0.0',
      description: '',
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          name: 'authorization',
        },
      },
    },
    security: [
      {
        Authorization: [],
      },
    ],
  },
  apis: [
    './src/router/*.ts',
    './src/entities/*/*.router.ts',
    './src/entities/*/*.model.ts',
    './src/fileUpload/*.router.ts',
    './src/fileUpload/*.model.ts',
    './src/authentication/*/*.router.ts',
    './src/authentication/*/*.model.ts',
  ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptioner)

export default swaggerSpec
