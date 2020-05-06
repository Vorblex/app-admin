const Token = require('../models/token')
const { v4: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const { access, refresh } = require('../../config').tokens

const generateAccessToken = (userId, role, email) => {
  const payload = {
    userId,
    role,
    email,
    type: access.type
  }

  const options = { expiresIn: access.expiresIn }
  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

const generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: refresh.type
  }

  const options = { expiresIn: refresh.expiresIn }

  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.JWT_SECRET, options)
  }
}

const replaceDbRefreshToken = async (tokenId, userId) => {
  const oldToken = await Token.findOne({ where: {userId} })

  oldToken && await oldToken.destroy()
  
  const token = await Token.create({ tokenId, userId })
  return token
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken
}