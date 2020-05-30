var express = require('express')
var graphqlHTTP = require('express-graphql')

var userSchema = require('../src/schema/userSchema')
var usersController = require('../src/controller/userController')

var auth = require('../utils/auth')

var router = express.Router()

const errorHandler = error => ({
  message: error.message,
  state: error.originalError && error.originalError.state,
  locations: error.locations,
  path: error.path
})

router.use('/user', graphqlHTTP({
  schema: userSchema,
  rootValue: usersController,
  graphiql: true,
  customFormatErrorFn: errorHandler
}))

router.use('/authenticate', graphqlHTTP({
  schema: userSchema,
  rootValue: auth,
  graphiql: true,
  customFormatErrorFn: errorHandler
}))

module.exports = router