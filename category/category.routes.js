const express = require('express')
const router = express.Router()
const categoryService = require('./category.service')
const { authJWT } = require('../auth/auth')

router.get('/:id', authJWT, async (req, res) => {
    try {
        const category = await categoryService.readOne(req.params.id);
        res.send(category)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.get('/', authJWT, async (req, res) => {
    try {
        const category = await categoryService.read();
        res.send(category)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.post('/', authJWT, async (req, res) => {
    try {
        const category = await categoryService.create(req.body);
        res.send(category)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.put('/:id', authJWT, async (req, res) => {
    try {
        const category = await categoryService.update(req.params.id, req.body);
        res.send(category)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.delete('/:id', authJWT, async (req, res) => {
    try {
        const category = await categoryService.del(req.params.id);
        res.send(category)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

module.exports = router;