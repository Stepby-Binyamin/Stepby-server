const express = require('express');
const { authJWT } = require('../auth/auth');
const userService = require("../user/user.service");

// const userController = require("./user.control")
const router = express.Router();



router.post('/check-code', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "verify the sms-code of the biz user"
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
    try {
        const result = await userService.sms(req.body)
        if (result.status !== 0) throw { message: result.message, status: 406 }
        res.send(result);
    } catch (err) {
        res.status(err.status || 406).send(err.message)
    }

});


router.post('/new-client', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "create a new client"
    console.log("newclient");
    try {
        const newClient = await userService.newClient(req.body);
        res.send(newClient);
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/register', async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "registration of biz user"

    try {
        await userService.register(req.body);
        res.send("new biz was created");
    } catch (error) {
        res.send(error.message);
    }
});


router.post('/login', async (req, res) => {
    // #swagger.tags= ['Users']
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
    try {
        const acknowledged = await userService.editBiz(req.body, req.user);
        res.send(acknowledged);
    } catch (error) {
        res.send(error.message);
    }
})

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


router.get('/get-all-biz', [authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all the active biz's"
    try {
        const allbiz = await userService.getAllBiz();
        res.send(allbiz);
    } catch (error) {

    }
});

router.get('/get-my-clients',[authJWT], async (req, res) => {
    // #swagger.tags= ['Users']
    // #swagger.description = "get all clients per biz"
    try{
        const x = await userService.getAllClientsByBiz(req.body);
        res.send(x);
    }catch(error){

    }
});

module.exports = router;
