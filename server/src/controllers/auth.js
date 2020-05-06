// const { User, Token } = require('src/models')
const User = require('../models/user')
const Role = require('../models/role')
const Token = require('../models/token')
const bCrypt = require('bcrypt-node')
const jwt = require('jsonwebtoken')
const authHelper = require('../helpers/authHelper')

const updateTokens = (userId, ...params) => {
  const accessToken = authHelper.generateAccessToken(userId, ...params)
  const refreshToken = authHelper.generateRefreshToken()

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token
    }))
}

const signIn = (req, res) => {
  const {email, password} = req.body
  User.findOne( {
    where: {email},
    include: [{
      model: Role
    }]
  } )
  .then( user => {
      if(!user) {
        return res.status(401).json({message: 'User does not exist!'})
      }
      const isValid = bCrypt.compareSync(password, user.password)

      
      if(isValid) {
        updateTokens(user.id, user.role.name, user.email)
          .then(tokens => res.json(tokens))
      } else {
        res.status(400).json({message: 'Invalid credentials!'})
      }
    })
    .catch(err => res.status(500).json({message: err.message}))
}

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body
  let payload

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET)

    if(payload.type !== 'refresh') {
      return res.status(400).json({message: 'Invalid token!'})
    }
  } catch(e) {
    if(e instanceof jwt.TokenExpiredError) {
      return res.status(400).json({message: 'Ref Token expired!'})
    } else if(e instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({message: 'Invalid token!'})
    }
  }

  Token.findOne( { where: {tokenId: payload.id} })
    .then(async token => {
      if(token === null) {
        throw new Error('Invalid token!')
      }

      const user = await User.findOne({
        where: {id: token.userId},
        include: [{
          model: Role
        }]
      })

      return updateTokens(user.id, user.role.name, user.email)
    })
    .then(tokens => res.json(tokens))
    .catch(err => res.status(400).json({message: err.message}))
}

module.exports = {
  signIn,
  refreshTokens
}