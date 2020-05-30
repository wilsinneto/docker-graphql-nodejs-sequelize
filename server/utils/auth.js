const { findEmail, updateUser } = require('../src/service/userService')
const ValidationError = require('../utils/ValidationError')
const transport = require('./mailer')

const { encode } = require('./jwt')
const crypto = require('crypto')

const resolvers = {

  sign: async ({ input }, { res }) => {
    let errors = [];
    let { email, password } = input

    let user = await findEmail({ where: { email } })
    if (!user) errors.push({ key: 'email', message: 'User not found.' })
    if (user && !await user.correctPassword(password)) errors.push({ key: 'password', message: 'Invalid password.' })

    if (errors.length) throw new ValidationError(errors)

    let token = await encode({ userId: user.id })

    // res.cookie("token", token, { expire: 60 * 60 * 24 })
    res.cookie("token", token)

    let { id, name } = user.dataValues
    return { id, name, email, token }
  },

  me: async (_, { userId }) => {
    let errors = [];

    if (!userId) errors.push({ key: 'token', message: 'Invalid Token' })
    if (errors.length) throw new ValidationError(errors)

    return await findEmail({ where: { id: userId } })
  },

  forgotMyPassword: async ({ email }) => {
    let errors = []

    let user = await findEmail({ where: { email } })
    if (!user) errors.push({ key: 'email', message: 'User not found.' })

    if (errors.length) throw new ValidationError(errors)

    let token = crypto.randomBytes(16).toString('base64')

    let now = new Date()
    now.setHours(now.getHours() + 1)

    const options = { where: { id: user.id } }
    const payload = {
      passwordResetToken: token,
      passwordResetExpires: now
    }

    await updateUser(payload, options)

    let name = user.name
    transport.sendMail({
      to: email,
      from: 'wngaspar10@gmail.com',
      template: 'index',
      ctx: { name, token }
    })

    return true
  },

  resetMyPassword: async (args) => {
    let errors = []
    let { email, token, password } = args.input

    let user = await findEmail({ where: { email } })

    if (user) {
      if (token !== user.passwordResetToken) errors.push({ key: 'token', message: 'Token invalid.' })

      let now = new Date()
      if (now > user.passwordResetExpires) errors.push({ key: 'token', message: 'Token expired, generate a new one.' })
    } else errors.push({ key: 'email', message: 'User not found.' })

    if (errors.length) throw new ValidationError(errors)

    user.password = password
    await user.save()

    return true
  }
}

module.exports = resolvers