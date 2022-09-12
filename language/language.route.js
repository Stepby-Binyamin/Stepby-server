const express = require('express')
const router = express.Router()
const languageService = require('./language.service')
const { authJWT } = require('../auth/auth')

router.get('/:code', async (req, res) => {
    try {
        const language = await languageService.readOne(req.params.code);
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.get('/', async (req, res) => {
    try {
        const language = await languageService.read();
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.post('/', async (req, res) => {
    try { 
        const language = await languageService.create(req.body);
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.put('/langSet/:code', async (req, res) => {
    try {
        const language = await languageService.update(req.params.code, req.body);
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.put('/:code', async (req, res) => {
    try { 
        const language = await languageService.addWordsInOne(req.params.code, req.body);
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

//remove 1 word  / code: language-code  /body:{key: "wordKey to be removed"}
router.put('/remove/:code', async (req, res) => {  
    try { 
        const language = await languageService.removeWordInOne(req.params.code, req.body.key);
        res.send(language)
    }
    catch (error) {
        if (error.code && error.code < 1000) {
          res.status(error.code).send(error.message)
        } else {
          res.status(500).send("something went wrong")
        }
      }
})

router.delete('/:id', async (req, res) => {
    try {
        const language = await languageService.del(req.params.id);
        res.send(language)
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