const express = require('express');
const userService = require("../user/user.service");

// const userController = require("./user.control")
const router = express.Router();



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

router.put('editbiz', async (res,req) => {
    //   #swagger.tags= ['Users']
    // #swagger.description= 'make changes on business'
    try{
        await userService.editBiz(res.body);
    }catch(error){
        req.send(error.message);
    }
})



// const userController = require("./user.control")



module.exports = router
