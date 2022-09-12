const express = require('express');
const playlistLogic = require("../user/user.service");

const router = express.Router();



router.post('/newbiz', async (res, req) => {
    try {
        await playlistLogic.newBiz(req.body);
        res.send("new biz was created");
    } catch (error) {
        res.send(error.message);
    }
});