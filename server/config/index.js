const path = require('path')

module.exports = {
    port: 9999,
    dbURL: `postgres://${process.env.PG_CREDENTIALS}@localhost:5432/admin-project`,
    DESTINATION: __dirname + '../../../client/public/uploads',
    tokens: {
        access: {
          type: 'access',
          expiresIn: '1m'
        },
        refresh: {
          type: 'refresh',
          expiresIn: '59m'
        }
    }
}
