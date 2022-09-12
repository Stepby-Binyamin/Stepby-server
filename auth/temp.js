const express = require('express')
const axios = require('axios')
const router = express.Router()
const bcrypt = require('bcrypt')
const { getXML, xmlHeaders } = require('./xml')
const { checkValidNumber, generateCode, checkExistUser } = require('./verification')
const { codeModel } = require('./codeSchema')





// verify.checkValidNumber('0542085009').then(function(result){
//     console.log(1234, result)
//   })




const sendSMS = async (phoneNumber) => {
    const code = generateCode(4)
    phoneNumber = await checkValidNumber(phoneNumber)

    const xml = getXML({
        sms: {
            user: {
                username: process.env.SMS_USER_NAME
            },
            source: "0525666679",
            destinations: {
                phone: phoneNumber
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
    codeModel.create({ phoneNumber: phoneNumber, code: hashCode })
    console.log(res.data)
    return res.data
}


router.post('/code',checkExistUser, async (req, res) => {
    try {
        
        const phoneNumber = req.body.phone
        const code = generateCode(4)
        const hashCode = await bcrypt.hash(code, 12)
        if(checkExistUser) await codeModel.updateOne({phoneNumber:phoneNumber},{dateSent: Date.now()})
        else await codeModel.create({ phoneNumber: phoneNumber, code: hashCode })
        const result = await codeModel.find({})
            res.send(result)
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }

})
// router.post('/code',async (req,res)=>{
//     try{
//     const result = await sendSMS(req.body.phone)
//     // const result = generateCode(4)

//     res.send(result)
//    }catch(err){
//     res.status(err.status || 406).send(err.message)
//    }

// })

module.exports = router