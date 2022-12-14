const express = require('express');
const { authJWT } = require('../auth/auth');
const userService = require("../user/user.service");
const router = express.Router();

//false all user and token
// true;
router.post('/check-code', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "verify the sms-code of the biz user"
    // #swagger.parameters['phoneNumber'] = {description:'users phone number'}
    // #swagger.parameters['code'] = {description:'code sent by 019 system in the login'}

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
        const token = req.headers.authorization;
        console.log("🚀 ~ file: user.route.js ~ line 34 ~ router.post ~ token", token)
        let activeUser;
        if (!token) {
            const result = await userService.sms(req.body)
            if (result.status !== 0) throw { message: result.message, status: 401 }
            res.send(result);
        }
        if (token) activeUser = await userService.verifyBeforeSMS(token, req.body)
        if (activeUser !== 401) res.send(activeUser)
        if (activeUser === 401) {
            const result = await userService.sms(req.body)
            if (result.status !== 0) throw { message: result.message, status: 401 }
            res.send(result);
        }
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }

});
router.post('/new-client', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "create a new client"
    // #swagger.parameters['fullName'] = {description:'user details'}
    // #swagger.parameters['phoneNumber'] = {description:'user details'}
    // #swagger.parameters['email'] = {description:'user details'}
    // #swagger.parameters['user'] = {description:'user token'}

    try {
        const newClient = await userService.newClient(req.body, req.user);
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
router.put('/edit-biz', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "edit details of biz user"
    // #swagger.parameters['user'] = {description:'user token'}
    // #swagger.parameters['firstName '] = {description:'user details'}
    // #swagger.parameters['lastName'] = {description:'user details'}
    // #swagger.parameters['bizName'] = {description:'user details'}
    // #swagger.parameters['categories'] = {description:'user details'}
    console.log(req.body);
    try {
        if(req.body.categories) {
            const result = await userService.editBizCategories(req.body, req.user)
            res.send(result);
        } 
        else{
            const result = await userService.editBiz(req.body, req.user);
            res.send(result);
        } 
    } catch (error) {
        res.status(error.status || 406).send(error.message)
    }
});
router.post('/remove-biz', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "deactivate biz user from DB"
    try {
        const removed = await userService.removeBiz(req.body, req.user);
        res.send(removed);
    } catch (error) {
        res.send(error.message);
    }
});
router.get('/get-all-categories',async(req,res)=>{
    try {
        const result = await userService.getAllCategories();
        res.send(result);
    } catch (error) {
        res.status(error.status || 406).send(error.message)
    }
})
//only for admin
router.get('/get-all-biz', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all active bizs"
    try {
        const allbiz = await userService.getAllBiz(req.user);
        res.send(allbiz);
    } catch (error) {
        res.send(error.message);
    }
});
router.get('/get-my-clients', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all biz's clients"
    try {
        const x = await userService.getAllClientsByBiz(req.user);
        res.send(x);
    } catch (error) {
        res.send(error.message);
    }
});
router.get('/get-user', [authJWT], async (req, res) => {
    res.send(req.user);
});
// TODO: For development purposes only, delete before the production
router.post('/loginToUser', async (req, res) => {
    try {
        const result = await userService.loginToUser(req.body)
        console.log(result);
        res.send(result)
    } catch (err) {
        console.log({ err });
        res.status(err.status || 406).send(err.message)
    }
});
module.exports = router;