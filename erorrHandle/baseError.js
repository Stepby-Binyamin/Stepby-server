class BaseError extends Error {
    constructor (mes,name, statusCode, isOperational, description,user) {
    super(description)
   
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this)
    this.user=user
    this.mes = mes
    }
   }
module.exports = BaseError