const crypto = require("crypto")

const accessTokenSK = crypto.randomBytes(32).toString('hex')
const refreshTokenSK = crypto.randomBytes(32).toString('hex')

console.table({ accessTokenSK, refreshTokenSK });