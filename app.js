var debug = require('debug')('tm-uaa-login')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var tms = require('./routes/tms')
var supportMsg = require('./routes/wechat')
var baseInfo = require('./routes/baseInfo')
var testProxy = require('./routes/Proxy')
var teacher = require('./routes/teacher')

var app = express()

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static('public'))
app.use('/', index)
app.use('/tms', tms)
app.use('/baseInfo', baseInfo)
app.use('/supportMsg', supportMsg)
app.use('/testProxy', testProxy)
app.use('/teacher', teacher)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.set('port', process.env.PORT || 6226)

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port)
})
