'use strict';

const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: {
      allowNull: false,
      isAlpha: true,
      type: DataTypes.STRING(100)
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(100),
      validate: {
        notNull: true,
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('password')
      }
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('passwordResetToken')
      }
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('passwordResetExpires')
      }
    },
    salt: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('salt')
      }
    }
  }, {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  // exemplo de verificação caso user esteja cadastrado e de se redirect após autenticado
  // https://stackoverflow.com/questions/34120548/using-bcrypt-with-sequelize-model

  // fonte dos códigos cryptografia abaixo
  // https://medium.com/@benjaminpwagner/using-sequelize-hooks-and-crypto-to-encrypt-user-passwords-5cf1a27513d9

  Users.generateSalt = async function () {
    return await crypto.randomBytes(16).toString('base64')
  }

  Users.encryptPassword = async function (plainText, salt) {
    return await crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }

  const setSaltAndPassword = async user => {
    if (user.changed('password')) {
      user.salt = await Users.generateSalt()
      user.password = await Users.encryptPassword(user.password, user.salt)
    }
  }

  Users.beforeCreate(setSaltAndPassword)
  Users.beforeUpdate(setSaltAndPassword)

  Users.prototype.correctPassword = async function (enteredPassword) {
    return await Users.encryptPassword(enteredPassword, this.salt) === this.password
  }

  // Users.associate = function (models) {
  //   // associations can be defined here
  // };
  return Users;
};