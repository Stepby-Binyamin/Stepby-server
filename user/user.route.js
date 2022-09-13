const express = require('express');
const userService = require("../user/user.service");

// const userController = require("./user.control")
const router = express.Router();


router.post('/check-code', async (req,res)=>{
    try{
      const result = await userService.verify(req.body)
      console.log({result});
      if(result.status == 406) throw result
      res.send(result)
    } catch (err){
      console.log({err});
      res.status(err.status || 406).send(err.message)
    }
  });


router.post('/send-code', async (req, res) => {
    try {
      const result =  await userService.sms(req.body)
        if (result.status !== 0) throw {message: result.message, status: 406 }
            res.send(result);
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }

});

router.post('/newclient', async (res, req) => {
    console.log("newclient");
    try {
        const newClient = await userService.newClient(res.body);
        req.send(newClient);
    } catch (error) {
        req.send(error.message);
    }});

router.post('/register', async (res, req) => {
    //   #swagger.tags= ['Users']
    // #swagger.description= 'register'
    try {
        await userService.register(res.body);
        req.send("new biz was created");
    } catch (error) {
        req.send(error.message);
    }
});

router.post('/login', async (res, req) => {
    try {
        await userService.login(res.body);
        req.send("logged in");
    } catch (error) {
        req.send(error.message);
    }
});

router.put('/editbiz', async (res, req) => {
    //   #swagger.tags= ['Users']
    // #swagger.description= 'make changes on business'
    try {
        await userService.editBiz(res.body);
    } catch (error) {
        req.send(error.message);
    }
})

router.post('/removebiz', async (res,req) => {
    try{
       const removed =  await userService.removeBiz(res.body);
       req.send(removed);
    } catch(error){
        req.send(error.message);
    }
});

router.post('/getallbiz', async (res, req) => {
    try{
        const allbiz = await userService.getAllBiz();
        req.send(allbiz);
    }catch(error){

    }
});
// const userController = require("./user.control")



module.exports = router
