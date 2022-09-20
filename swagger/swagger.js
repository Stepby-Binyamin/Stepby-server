const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swaggerOutput.json'
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles)
