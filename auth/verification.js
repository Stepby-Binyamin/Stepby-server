// const app = require('express')()
const { codeModel } = require('./codeSchema')
const jwt = require('./jwt')


async function checkExistUser(req, res, next) {
  try {
    const exist = await codeModel.findOne({ phoneNumber: req.body.phone })
    if (exist) return true
    else return false
    next()
  } catch (err) {
    console.log(err);
  }
}

async function verifyCode(req, res, next) {
  try {
    const { code, phoneNumber } = req.body
    const DBcode = await codeModel.findOne({ phoneNumber: phoneNumber })
    if (!DBcode) throw { message: 'invalid phone number', status: 406 }

    if (await !bcrypt.compare(code, DBcode.code)) throw { message: 'invalid code', status: 406 }
    const existUser = await userModel.findOne({ phoneNumber: phoneNumber })

    if (existUser) {
      const token = await jwt.createToken(existUser._id)
      const result = { newUser: false, token: token }
      res.send(result)
    } else {
      const token = await jwt.createToken(phoneNumber)
      const result = { newUser: true, token: token }
      res.send(result)
    }


  } catch (err) {
    console.log(err);
  }
  next()
}


const checkValidNumber = async (phoneNumber = '123') => {
  if (phoneNumber[0] !== '0' || phoneNumber[1] !== '5' || phoneNumber.length !== 10) return { message: 'invalid phone number', status: 406 }
  const result = await removeZero(phoneNumber)
  return result
}

async function removeZero(phoneNumber = '123', countryCode = '972') {
  return `${countryCode}${phoneNumber.slice(1)}`
}

function generateCode(codeLength) {
  let result = []
  for (let i = 0; i < codeLength; i++) {
    result.push((Math.floor(Math.random() * (9 - 1 + 1) + 1)))
  }
  result = "".concat(...result)
  return result
}





module.exports = { checkValidNumber, generateCode, verifyCode, checkExistUser }