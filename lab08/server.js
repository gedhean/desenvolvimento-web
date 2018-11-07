/*
 * Servidor simples para carga de arquivos fixos e de 
 * scripts em EJS 
 */
const DAY_IN_MILLISECDOS = 1000 * 60 * 60 * 24
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { createUserIfNotExist, findUser, saveCv, findCv, db } = require('./db')

app.use(require('morgan')('dev'))
app.use(express.static(path.join(__dirname + '/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'Gedhean is awesome!', cookie: { maxAge: 30 * DAY_IN_MILLISECDOS } }))
app.use(function(req, res, next) {
  req.user = req.session.user || {}
  next()
})
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')
app.set('db', db)

app.get('/', function(req, res) {
  console.log('Session:', req.session)
  fs.readdir(path.resolve(__dirname + '/public/users-data'), (err, data) => {
    if (err) {
      res.render('404')
    }
    res.render('index', { welcome: 'Welcome to the CV land', users: data })
  })
})

// app.get('/cv', function(req, res) {
//   const user = req.query.user
//   const users = fs.readdirSync(path.resolve(__dirname + '/public/users-data'))

//   if (users.includes(user)) {
//     fs.readFile(
//       path.resolve(`${__dirname}/public/users-data/${user}/data.json`),
//       (err, userData) => {
//         if (err) {
//           res.render('404')
//           console.log(err)
//         }
//         res.render('cv', JSON.parse(userData))
//         // console.log(req.query, JSON.parse(userData))
//       }
//     )
//   } else {
//     res.render('404')
//   }
// })

app.get('/cv', function(req, res) {
  if (req.session.user) {
    const cv = findCv(req.user.email)
    if (cv) res.render('cv', { cvHtml: cv.cvHtml })
    else res.redirect('/cv/new')
  } else res.redirect('/login?from=/cv')
})

app.get('/cv/new', function(req, res) {
  console.log('Attempting to create cv. Is user logged?', req.user.name);
  if(req.user.email) res.render('new-cv')
  else res.redirect('/login?from=/cv/new')
})

app.post('/cv/new', function(req, res) {
  const user = req.session.user
  if (user && user.email && req.body.cv) {
    console.log('User creating cv...:', req.session.user.name)
    saveCv(user.email, req.body.cv)
    res.send(JSON.stringify({ message: 'CV criado com sucesso' }))
  } else {
    res.send(JSON.stringify({ error: 'Usuário precisa logar' }))
  }
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
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads/'))
  },
  filename: function(req, file, cb) {
    console.log(req.body)
    console.log(file)
    cb(null, `${req.body.user}-${req.body.section}.${file.originalname.split('.').pop()}`)
  }
})

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE }
}).single('file')

app.post('/file/upload', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.send(' <h2>O seu upload NÃO foi realizado! <h2>')
      console.log(err)
    }
    res.send('<h2>Upload realizado com sucesso! </h2>')
  })
})

app.get('/login', function(req, res) {
  console.log('Attempting to login:', req.query);
  res.render('login')
})

app.post('/login', function(req, res) {
  const user = findUser(req.body)
  console.log('Login user data:', req.body)
  console.log('User trying to login:', user)
  if (user) {
    req.session.user = user
    res.redirect(req.query.from || '/')
  } else res.redirect(`/register?from=${req.query.from}`)
})

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', function(req, res) {
  createUserIfNotExist(req.body)
  res.redirect(req.query.from || '/login')
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
