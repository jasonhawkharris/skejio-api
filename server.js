const express = require('express')
const cors = require('cors')

const routes = require('./routes')
const status = require('./routes/status')

const server = express()

server.use(express.json({ limit: '50mb' }))
server.use(express.urlencoded({ limit: '50mb', extended: true }))


server.use(cors())

const authRequired = require('./middleware/authRequired')

server.use('/api/v1/auth', routes.auth)
server.use('/api/v1/mgmt', authRequired, routes.mgmt)
server.use('/api/v1/agencies', authRequired, routes.agencies)
server.use('/api/v1/comments', authRequired, routes.comments)
server.use('/api/v1/tours', authRequired, routes.tours)
server.use('/api/v1/images', authRequired, routes.images)
server.use('/api/v1/notifications', authRequired, routes.notifications)
server.use('/api/v1/threads', authRequired, routes.threads)
server.use('/api/v1/tourdates', authRequired, routes.tourdates)
server.use('/api/v1/todos', authRequired, routes.todos)
server.use('/api/v1/user', authRequired, routes.user)
server.use('/api/v1/venues', authRequired, routes.venues)
server.use('/api/v1/merch', authRequired, routes.merch)
server.use('/api/v1/invites', authRequired, routes.invites)
server.use('/', status)
// connection
module.exports = server
