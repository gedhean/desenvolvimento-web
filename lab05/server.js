/*
 * Servidor simples para carga de arquivos fixos e de 
 * scripts em EJS 
 */

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const path = require('path')

app.use(express.static(path.join(__dirname + '/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

app.get('/users/:userId/books/:bookId', function(req, res) {
  //res.send(req.params)
  res.render('opaNovo', req.params)
})

app.get('/', function(req, res) {
  fs.readdir(path.resolve(__dirname + '/public/users-data'), (err, data) => {
    if (err) {
      res.render('404')
    }
    res.render('index', { welcome: 'Welcome to the CV land', users: data })
  })
})

app.get('/cv', function(req, res) {
  const user = req.query.user
  const users = fs.readdirSync(path.resolve(__dirname + '/public/users-data'))

  if (users.includes(user)) {
    fs.readFile(
      path.resolve(`${__dirname}/public/users-data/${user}/data.json`),
      (err, userData) => {
        if (err) {
          res.render('404')
          console.log(err)
        }
        res.render('cv', JSON.parse(userData))
        console.log(req.query, JSON.parse(userData))
      }
    )
  } else {
    res.render('404')
  }
  // executa cv.ejs
})

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
})
