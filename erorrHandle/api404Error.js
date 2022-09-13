const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

class Api404Error extends BaseError {
 constructor (
mes,
 name,
 statusCode = httpStatusCodes.NOT_FOUND,
 description = 'Not found.',
 isOperational = true,
 user,
 
 ) {
 super(mes,name, statusCode, isOperational, description,user)
 }
}

module.exports = Api404Error