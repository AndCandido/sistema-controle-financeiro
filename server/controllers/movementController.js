const movementModel = require('../models/movementModel')

exports.getMovements = async (req, res) => {
    const movements = await movementModel.getMovements()
    return res.json(movements)
}

exports.addMovement = async (req, res) => {
    const movement = await movementModel.addMovement(req.body)
    return res.json(movement)
}

exports.deleteMovement = async (req, res) => {
    const movement = await movementModel.deleteMovement(req.params.id)
    return res.json(movement)
}

exports.updateMovement = async (req, res) => {
    const movement = await movementModel.updateMovement(req.params.id, req.body)
    return res.json(movement)
}