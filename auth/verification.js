// const app = require('express')()
const { codeModel } = require('./codeSchema')
const axios = require('axios')
const jwt = require('./jwt')
const bcrypt = require('bcrypt')
const { getXML, xmlHeaders } = require('./xml')

const userModel = require('../user/user.model')

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
  console.log("🚀 ~ file: verification.js ~ line 34 ~ sendSMS ~ res.data", res.data)
  const hashCode = await bcrypt.hash(code, 12)
  await createOrUpdate(phoneNumber, hashCode)
  return res.data
}
const createOrUpdate=async(phoneNumber, hashCode)=> {
  const existUser = await checkExistUser(phoneNumber)
  existUser ? 
    await codeModel.updateOne({ phoneNumber: phoneNumber }, { dateSent: Date.now(), code: hashCode }) 
    :
    await codeModel.create({ phoneNumber: phoneNumber, code: hashCode })
}
const checkExistUser=async (phone) =>{
  const exist = await codeModel.findOne({ phoneNumber: phone })
  // console.log(await codeModel.findOne({ phoneNumber: phone }))
   return exist ? true : false
}
const verifyCode= async(data)=> {
  const { code, phoneNumber } = data;
  const DBcode = await codeModel.findOne({ phoneNumber: phoneNumber })

  if (!DBcode) return { message: 'invalid phone number', status: 406 }
  const compare=await bcrypt.compare(code, DBcode.code)
  console.log("🚀 ~ file: verification.js:57 ~ verifyCode ~ compare", compare)
  if (compare) {
    let existUser = await userModel.readOne({ phoneNumber: phoneNumber })
    if(!existUser) 
      existUser = await userModel.create({ phoneNumber, permissions: "biz" });
    return { user: existUser,token: await jwt.createToken(existUser._id) }
  } 
  else {
    return { message: 'invalid code', status: 406 }
  }
}
const checkValidNumber = async (phoneNumber = '123') => {
  if (phoneNumber[0] !== '0' || phoneNumber[1] !== '5' || phoneNumber.length !== 10) 
    return { message: 'invalid phone number', status: 406 }
  return await removeZero(phoneNumber)
}
const removeZero=async(phoneNumber = '123', countryCode = '972')=> {
  return `${countryCode}${phoneNumber.slice(1)}`
}
const generateCode=(codeLength) =>{
  let result = []
  for (let i = 0; i < codeLength; i++) {
    result.push((Math.floor(Math.random() * (9 - 1 + 1) + 1)))
  }
  result = "".concat(...result)
  return result
}
module.exports = { sendSMS, verifyCode }