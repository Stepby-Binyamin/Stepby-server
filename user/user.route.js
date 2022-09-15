const express = require('express');
const { authJWT } = require('../auth/auth');
const userService = require("../user/user.service");

// const userController = require("./user.control")
const router = express.Router();



//false all user and token
// true;
router.post('/check-code', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "verify the sms-code of the biz user"
    // #swagger.parameters['phoneNumber'] = {description:'users phone number'}
    // #swagger.parameters['code'] = {description:'code sent by 019 sistem in the login'}

    try {
        const result = await userService.verify(req.body)
        console.log({ result });
        if (result.status == 406) throw result
        res.send(result)
    } catch (err) {
        console.log({ err });
        res.status(err.status || 406).send(err.message)
    }
});


router.post('/send-code', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "send SMS code to biz user"
    // #swagger.parameters['phoneNumber'] = {description:''}
    try {
        const result = await userService.sms(req.body)
        if (result.status !== 0) throw { message: result.message, status: 406 }
        res.send(result);
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }
    
});


router.post('/new-client',[authJWT],async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "create a new client"
    // #swagger.parameters['fullName'] = {description:'user details'}
    // #swagger.parameters['phoneNumber'] = {description:'user details'}
    // #swagger.parameters['email'] = {description:'user details'}
    // #swagger.parameters['user'] = {description:'user token'}

    try {
        const newClient = await userService.newClient(req.body,req.user);
        res.send(newClient);
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/register', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "registration of biz user"
    // #swagger.parameters['firstName '] = {description:'user details'}
    // #swagger.parameters['lastName'] = {description:'user details'}
    // #swagger.parameters['bizName'] = {description:'user details'}
    // #swagger.parameters['categories'] = {description:'user details'}
    // #swagger.parameters['phoneNumber'] = {description:'user details'}
    // #swagger.parameters['fullName'] = {description:'user details'}
    // #swagger.parameters['email'] = {description:'user details'}
    try {
        await userService.register(req.body);
        res.send("new biz was created");
    } catch (error) {
        res.send(error.message);
    }
});


//probably redundant function
router.post('/login', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.parameters['phoneNumber'] = {description:'user details'}
    // #swagger.description = "login of biz user"

    try {
        await userService.login(req.body);
        res.send("logged in");
    } catch (error) {
        res.send(error.message);
    }
});


router.put('/edit-biz', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "edit details of biz user"
    console.log(req.body);
    console.log(req.body.data)
    console.log(req.body.user);
    // #swagger.parameters['user'] = {description:'user token'}
    // #swagger.parameters['firstName '] = {description:'user details'}
    // #swagger.parameters['lastName'] = {description:'user details'}
    // #swagger.parameters['bizName'] = {description:'user details'}
    // #swagger.parameters['categories'] = {description:'user details'}
    try {
        const acknowledged = await userService.editBiz(req.body.data,req.body.user);
        res.send(acknowledged);
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/remove-biz',[authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "deactivate biz user from DB"
    try {
        const removed = await userService.removeBiz(req.body,req.user);
        res.send(removed);
    } catch (error) {
        res.send(error.message);
    }
});


//only for admin
router.get('/get-all-biz', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all active bizs"
    try {
        const allbiz = await userService.getAllBiz();
        res.send(allbiz);
    } catch (error) {
        res.send(error.message);
    }
});

router.get('/get-my-clients',[authJWT] , async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all biz's clients"
    try{
        const x = await userService.getAllClientsByBiz(req.user);
        res.send(x);
    }catch(error){
        res.send(error.message);
    }
});

router.get('/get-user',[authJWT] , async (req, res) => {
    res.send(req.user);
});

module.exports = router;
