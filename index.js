'use strict'

const app = require('./app')

const hostname = 'localhost'
const port = '3003'

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`)
})