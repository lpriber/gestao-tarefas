import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { taskSwaggerSchema } from './schemas/tasks/tasks'
import { perfilSwaggerSchema } from './schemas/perfil/perfil'
import path from 'path'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestão de Tarefas',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ...taskSwaggerSchema,
        ...perfilSwaggerSchema,
      },
    },
  },
  apis: [
    path.join(__dirname, './routes/**/*.ts'),
    path.join(__dirname, '../src/routes/**/*.ts'),
  ],
}

const specs = swaggerJsdoc(options)

export { swaggerUi, specs }