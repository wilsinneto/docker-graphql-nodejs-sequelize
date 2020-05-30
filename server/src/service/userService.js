var { Users } = require('../models')

async function getUser(id) {
  return await Users.findByPk(id)
}

async function getUsers() {
  return await Users.findAll()
}

async function createUser(payload) {
  const user = await Users.create(payload)
  if (!user) throw new Error('User not created')
  return user
}

async function updateUser(payload, options) {
  const value = await Users.update(payload, options)
  if (!value) throw new Error('User not Updated')
  return value
}

async function deleteUser(id) {
  const value = await Users.destroy(id)
  if (!value) throw new Error('User not deleting!')
  return value
}

async function findEmail(payload) {
  return await Users.findOne(payload)
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  findEmail
}