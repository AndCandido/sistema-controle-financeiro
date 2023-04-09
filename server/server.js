require('dotenv').config()
const express = require('express')
const path = require('path')
const routes = require('./router')
const cors = require('cors')
const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, '..', 'frontend')))
app.use(express.json())
app.use(routes)

app.listen(port, () => console.log(`Rodando em http://localhost:${port}`))