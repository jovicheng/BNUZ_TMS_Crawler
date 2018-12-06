const request = require('superagent')
const express = require('express')
const router = express.Router()
const async = require('async')

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'

router.get('/', function(req, res, next) {
  const responInfos = {
    code: 403,
    msg: 'Authentication Failure.'
  }
  res.json(responInfos)
})

router.post('/', function(req, res, next) {
  var stuNum = req.body.stuNum
  var password = req.body.password
  async.waterfall(
    [
      function(callback) {
        request
          .get('http://tm.bnuz.edu.cn/login')
          .set('User-Agent', userAgent)
          .redirects(0)
          .end(function(response) {
            let authInfos = {}
            authInfos.XSRFTOKEN = response.response.header['set-cookie']
              .join(',')
              .match(/(XSRF-TOKEN=.+?);/)[1]
            authInfos.JSESSIONID = response.response.header['set-cookie']
              .join(',')
              .match(/(JSESSIONID=.+?);/)[1]
            authInfos.redirectUrl = response.response.header.location
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get(authInfos.redirectUrl)
          .set('User-Agent', userAgent)
          .set('Cookie', authInfos.XSRFTOKEN + ';' + authInfos.JSESSIONID)
          .redirects(0)
          .end(function(response) {
            authInfos.UAAXSRFTOKEN = response.response.header['set-cookie']
              .join(',')
              .match(/(UAA-XSRF-TOKEN=.+?);/)[1]
            authInfos.singleValue = []
            authInfos.singleValue[0] = authInfos.UAAXSRFTOKEN.split('=')[1]
            authInfos.singleValue[1] = authInfos.XSRFTOKEN.split('=')[1]
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .post('http://tm.bnuz.edu.cn/uaa/login')
          .type('form')
          .set('User-Agent', userAgent)
          .set(
            'Cookie',
            authInfos.UAAXSRFTOKEN +
              ';' +
              authInfos.XSRFTOKEN +
              ';' +
              authInfos.JSESSIONID
          )
          .set('X-UAA-XSRF-TOKEN', authInfos.singleValue[0])
          .set('X-XSRF-TOKEN', authInfos.singleValue[1])
          .send({
            username: stuNum,
            password: password
          })
          .redirects(0)
          .end(function(response) {
            authInfos.newUAAXSRFTOKEN = response.response.header['set-cookie']
              .join(',')
              .split(',')[2]
              .match(/(UAA-XSRF-TOKEN=.+?);/)[1]
            authInfos.newJSESSIONID = response.response.header['set-cookie']
              .join(',')
              .match(/(JSESSIONID=.+?);/)[1]
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get('http://tm.bnuz.edu.cn/uaa/')
          .set('User-Agent', userAgent)
          .set('X-UAA-XSRF-TOKEN', authInfos.singleValue[0])
          .set('X-XSRF-TOKEN', authInfos.singleValue[1])
          .set(
            'Cookie',
            authInfos.newUAAXSRFTOKEN +
              ';' +
              authInfos.newJSESSIONID +
              ';' +
              authInfos.XSRFTOKEN +
              ';' +
              authInfos.JSESSIONID
          )
          .redirects(0)
          .end(function(response) {
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get('http://tm.bnuz.edu.cn/login')
          .set('User-Agent', userAgent)
          .set('X-UAA-XSRF-TOKEN', authInfos.singleValue[0])
          .set('X-XSRF-TOKEN', authInfos.singleValue[1])
          .set('Cookie', authInfos.XSRFTOKEN + '; ' + authInfos.JSESSIONID)
          .redirects(0)
          .end(function(response) {
            authInfos.redirectUrl = response.response.header.location
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get(authInfos.redirectUrl)
          .set('User-Agent', userAgent)
          .set('X-UAA-XSRF-TOKEN', authInfos.singleValue[0])
          .set('X-XSRF-TOKEN', authInfos.singleValue[1])
          .set(
            'Cookie',
            authInfos.newUAAXSRFTOKEN +
              ';' +
              authInfos.newJSESSIONID +
              ';' +
              authInfos.XSRFTOKEN +
              ';' +
              authInfos.JSESSIONID
          )
          .redirects(0)
          .end(function(response) {
            authInfos.redirectUrl = response.response.header.location
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get(authInfos.redirectUrl)
          .set('Referer', 'http://tm.bnuz.edu.cn/ui/login')
          .set('User-Agent', userAgent)
          .set('X-UAA-XSRF-TOKEN', authInfos.singleValue[0])
          .set('X-XSRF-TOKEN', authInfos.singleValue[1])
          .set(
            'Cookie',
            authInfos.newUAAXSRFTOKEN +
              ';' +
              authInfos.newJSESSIONID +
              ';' +
              authInfos.XSRFTOKEN +
              ';' +
              authInfos.JSESSIONID
          )
          .redirects(0)
          .end(function(response) {
            authInfos.finalXSRFTOKEN = response.response.header['set-cookie']
              .join(',')
              .split(',')[3]
              .match(/(XSRF-TOKEN=.+?);/)[1]
            authInfos.finalJSESSIONID = response.response.header['set-cookie']
              .join(',')
              .match(/(JSESSIONID=.+?);/)[1]
            callback(null, authInfos)
          })
      },
      function(authInfos, callback) {
        request
          .get('http://tm.bnuz.edu.cn/api/user')
          .set('User-Agent', userAgent)
          .set(
            'Cookie',
            authInfos.finalJSESSIONID + ';' + authInfos.finalXSRFTOKEN
          )
          .then(function(response) {
            let userId = response.body.user.id
            let userName = response.body.user.name
            callback(null, userId, userName, authInfos)
          })
          .catch(function(err) {
            console.log(err)
          })
      },
      function(userId, userName, authInfos, callback) {
        request
          .get(
            'http://tm.bnuz.edu.cn/api/core/students/' + userId + '/schedules'
          )
          .set('User-Agent', userAgent)
          .set(
            'Cookie',
            authInfos.finalJSESSIONID + ';' + authInfos.finalXSRFTOKEN
          )
          .then(function(response) {
            callback(null, userName, response.body)
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    ],
    function(err, stuName, schedules) {
      var result = schedules
      result.username = stuName
      res.json(result)
    }
  )
})
module.exports = router
