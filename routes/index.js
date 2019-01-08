var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  const responInfos = {
    code: 403,
    msg: 'Authentication Failure.'
  }
  res.json(responInfos)
})

module.exports = router
