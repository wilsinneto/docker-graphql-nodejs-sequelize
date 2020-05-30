const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  findEmail } = require('../service/userService')
const ValidationError = require('../../utils/ValidationError')
const { encode } = require('../../utils/jwt')

const resolvers = {

  user: async ({ id }) => await getUser(id),

  users: async () => await getUsers(),

  addUser: async ({ input }, { res }) => {
    let errors = [];
    let payload = { name, email, password } = input
    let options = { where: { email } }

    if (await findEmail(options)) errors.push({ key: 'email', message: 'Email address already exists.' })

    if (errors.length) throw new ValidationError(errors)

    let user = await createUser(payload)

    let token = await encode({ userId: user.id })

    // res.cookie("token", token, { expire: 60 * 60 * 24 })
    res.cookie("token", token)

    let { id } = user.dataValues

    return { id, name, email, token }
  },

  updateUser: async ({ id, input }) => {
    const payload = { name, email, password } = input
    const options = { where: { id }, individualHooks: true }
    const user = await updateUser(payload, options)
    if (user[0]) {
      delete payload.password
      payload.id = id
      return payload
    }
  },

  deleteUser: async ({ id }) => {
    const options = { where: { id } }
    return await deleteUser(options)
  }

}

module.exports = resolvers