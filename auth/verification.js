// const app = require('express')()
const { codeModel } = require('./codeSchema')
const axios = require('axios')
const jwt = require('./jwt')
const bcrypt = require('bcrypt')
const { getXML, xmlHeaders } = require('./xml')
const {userModel} = require('../user/user.model')


const sendSMS = async (phoneNumber) => {
  const code = generateCode(4)
  const number = await checkValidNumber(phoneNumber)

  const xml = getXML({
    sms: {
      user: {
        username: process.env.SMS_USER_NAME
      },
      source: "0525666679",
      destinations: {
        phone: number
      },
      tag: "#",
      message: `קוד האימות שלך הוא ${code}`
    },
  })

  const authHeaders = {
    Authorization: `Bearer ${process.env.SMS_GENERAL_TOKEN}`
  }
  const res = await axios.post(process.env.SMS_API, xml, {
    headers: { ...xmlHeaders, ...authHeaders }
  })
  const hashCode = await bcrypt.hash(code, 12)
  await createOrUpdete(phoneNumber, hashCode)
  console.log(res.data)
  return res.data
}

async function createOrUpdete(phoneNumber, hashCode) {

  const existUser = await checkExistUser(phoneNumber)

  if (existUser) await codeModel.updateOne({ phoneNumber: phoneNumber }, { dateSent: Date.now(), code: hashCode })

  else await codeModel.create({ phoneNumber: phoneNumber, code: hashCode })
}

async function checkExistUser(phone) {
  const exist = await codeModel.findOne({ phoneNumber: phone })
  console.log(await codeModel.findOne({ phoneNumber: phone }))
  if (exist) return true
  else return false

}

async function verifyCode(req) {

  const { code, phoneNumber } = req.body
  const DBcode = await codeModel.findOne({ phoneNumber: phoneNumber })
  if (!DBcode) return { message: 'invalid phone number', status: 406 }

  console.log(await bcrypt.compare(code, DBcode.code));

  if (await bcrypt.compare(code, DBcode.code)) {
    const existUser = await userModel.findOne({ phoneNumber: phoneNumber })


    const result = 
    { newUser: existUser ? false : true,
     token: existUser ? await jwt.createToken(existUser._id) 
     : await jwt.createToken(phoneNumber, "5m") }
    return result

  } else {
    return { message: 'invalid code', status: 406 }
  }

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





module.exports = { sendSMS, verifyCode }