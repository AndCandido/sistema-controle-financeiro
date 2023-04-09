const connection = require('./connectMysql')

exports.getMovements = async () => {
    const query = "SELECT * FROM movements;"
    const [response] = await connection.execute(query)
    return response
}

exports.addMovement = async ({ description, type, amount }) => {
    const query = "INSERT INTO movements(description, type, amount, create_time) VALUES (?, ?, ?, ?)"
    const data = new Date(Date.now()).toUTCString()

    const [response] = await connection.execute(query, [ description, type, amount, data])
    return response
}

exports.deleteMovement = async (id) => {
    const query = "DELETE FROM movements WHERE id = ?"
    const [response] = await connection.execute(query, [ id ])
    return response
}

exports.updateMovement = async (id, { description, type, amount }) => {
    const query = "UPDATE movements SET description = ?, type = ?, amount = ? WHERE id = ?"
    const [response] = await connection.execute(query, [description, type, amount, id])
    return response
}