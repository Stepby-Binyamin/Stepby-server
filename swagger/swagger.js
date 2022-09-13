const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger/swaggerOutput.json'
const endpointsFiles = ['./server.js'] 

swaggerAutogen(outputFile, endpointsFiles)
