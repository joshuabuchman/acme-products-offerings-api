const express = require('express')

const app = express()
app.use(express.json())
const db = require('./db')
const path = require('path');
const uuid = require('uuid')

app.use('/api', require('./api'))

app.use((err, req, res, next) => {
    res.status(500).send({message: err.message})
})

app.get('/', ( req, res, next) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

const port = process.env.PORT || 3000

db.sync()
.then( () => {
    
    app.listen(port, () => {`Listenging on port ${port}`})
})

module.exports = app;