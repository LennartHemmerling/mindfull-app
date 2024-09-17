import express from 'express'
import bodyParser from 'body-parser'

import setupAPI from './api'

const app = express()

// middleware
app.use(express.urlencoded())
app.use(bodyParser.json())

setupAPI(app)

app.listen(3000)
console.log('Express started on port 3000')
