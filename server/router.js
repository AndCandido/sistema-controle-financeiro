const express = require('express')
const router = express.Router()

const movementController = require('./controllers/movementController')
 
router.get('/getMovements', movementController.getMovements)
router.post('/addMovement', movementController.addMovement)
router.delete('/deleteMovement/:id', movementController.deleteMovement)
router.put('/updateMovement/:id', movementController.updateMovement)

module.exports = router