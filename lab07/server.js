/*
 * Servidor simples para carga de arquivos fixos e de 
 * scripts em EJS 
 */

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const path = require('path')
const multer = require('multer')

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
        // console.log(req.query, JSON.parse(userData))
      }
    )
  } else {
    res.render('404')
  }
  // executa cv.ejs
})

app.get('/upload', function(req, res) {
  fs.readdir(path.resolve(__dirname + '/public/users-data'), (err, data) => {
    if (err) {
      res.render('404')
    }
    res.render('upload', { users: data })
  })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'public/uploads/') )
  },
  filename: function (req, file, cb) {
      console.log(req.body);
      console.log(file);
      cb(null, `${req.body.user}-${req.body.section}.${file.originalname.split('.').pop()}`);
  }
});

const MAX_SIZE = 10*1024*1024; // 10MB 

const upload = multer({
storage: storage,
limits: { fileSize: MAX_SIZE } 
}).single('file');

app.post('/file/upload', function (req,res) {
upload (req, res, function (err) {
  if (err) {
    res.send(' <h2>O seu upload NÃO foi realizado! <h2>');
    console.log(err); 
  }
  res.send('<h2>Upload realizado com sucesso! </h2>');
})
}); 

app.listen(8080, function() {
  console.log('Example app listening on port 8080!')
})
