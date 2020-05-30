const { sign, verify } = require('jsonwebtoken')

const secret = 'iyJhbGcaOaJIUzI1NaIsInR4cCI3IkpXVNJ7'

let encode = payload => sign(payload, secret, { expiresIn: 86400 })
let decoded = token => verify(token, secret)

module.exports = {
  encode,
  decoded
}