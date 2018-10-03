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
      res.end(err)
    }
    res.render('index', { welcome: 'Welcome to the CV land', users: data })
  })
})

app.get('/cv/:usu', function(req, res) {
  var arr1 = [],
    arr2 = []
  var diret
  diret = path.join(__dirname + '/public/data/' + req.params.usu)
  var dadosCV = {
    userName: req.params.usu,
    linesSec1: [],
    linesSec2: []
  }

  // Leitura dos dados da 1a secao
  fs.readFile(diret + '/s1.txt', function(err, data) {
    if (err) {
      return console.error(err)
    }
    dadosCV.linesSec1 = data.toString().split('\n')
  })

  // Leitura dos dados da 2a secao
  fs.readFile(diret + '/s2.txt', function(err, data) {
    if (err) {
      return console.error(err)
    }
    dadosCV.linesSec2 = data.toString().split('\n')

    // executa cv.ejs
    res.render('cv', dadosCV)
  })
})

/*
app.get('/rec/:fName', function (req, res) {
	var filename = "public/"+req.params.fName;
	console.log('Enviando arquivo '+filename);
	res.sendFile(
	   path.join(__dirname+'/'+filename)); 
});
*/

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
})
