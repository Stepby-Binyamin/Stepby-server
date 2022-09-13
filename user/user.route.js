const express = require('express');
const { authJWT } = require('../auth/auth');
const userService = require("../user/user.service");

// const userController = require("./user.control")
const router = express.Router();


router.post('/check-code', async (req, res) => {
    //   #swagger.tags= ['Users']
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
    //   #swagger.tags= ['Users']
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
    //   #swagger.tags= ['Users']
    // #swagger.description = "create a new client"
    console.log("newclient");
    try {
        const newClient = await userService.newClient(req.body);
        req.send(newClient);
    } catch (error) {
        req.send(error.message);
    }
});

router.post('/register', async (req, res) => {
    //   #swagger.tags= ['Users']
    // #swagger.description = "registration of biz user"

    try {
        await userService.register(req.body);
        req.send("new biz was created");
    } catch (error) {
        req.send(error.message);
    }
});

router.post('/login', async (req, res) => {
    //   #swagger.tags= ['Users']
    // #swagger.description = "login of biz user"
    try {
        await userService.login(req.body);
        req.send("logged in");
    } catch (error) {
        req.send(error.message);
    }
});

router.put('/edit-biz', [authJWT], async (req, res) => {
    //   #swagger.tags= ['Users']
    // #swagger.description = "edit details of biz user"
    try {
        const editedBiz = await userService.editBiz(req.body, req.user._id);
        req.send(editedBiz);
    } catch (error) {
        req.send(error.message);
    }
})

router.post('/remove-biz', async (req, res) => {
    //   #swagger.tags= ['Users']
    // #swagger.description = "remove biz user from DB (actually isActive: false)"
    try {
        const removed = await userService.removeBiz(req.body);
        req.send(removed);
    } catch (error) {
        req.send(error.message);
    }
});

router.get('/get-all-biz', async (req, res) => {
    //   #swagger.tags= ['Users']
    // #swagger.description = "get all the active biz's"
    try {
        const allbiz = await userService.getAllBiz();
        req.send(allbiz);
    } catch (error) {

    }
});


module.exports = router
