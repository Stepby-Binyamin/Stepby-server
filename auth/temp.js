const express = require('express')
const router = express.Router()
const { sendSMS, verifyCode } = require('./verification')





// verify.checkValidNumber('0542085009').then(function(result){
//     console.log(1234, result)
//   })






router.post('/check-code', async (req,res)=>{
  try{
    const result = await verifyCode(req)
    console.log({result});
    if(result.status == 406) throw result
    res.send(result)
  } catch (err){
    console.log({err});
    res.status(err.status || 406).send(err.message)
  }
})

router.post('/send-code', async (req, res) => {
    try {
        // const result = await sendSMS(req.body.phone)
        if (result.status !== 0) throw {message: result.message, status: 406 }
            res.send(result)
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }

})


module.exports = router