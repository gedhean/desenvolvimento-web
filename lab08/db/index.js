const path = require('path')
const Loki = require('lokijs')

const db = new Loki(path.join(__dirname, 'database.json'), {
  autosave: true,
  autoload: true,
  verbose: true,
  autosaveInterval: 3000,
  autoloadCallback: initDb
})

const User = db.addCollection('user')
const Cv = db.addCollection('cv')

/**
 * Create a user if not exist
 * @param {object} userData User data
 * @example
 * {
 *    name: "Gedhean Alevs",
 *    age: 23,
 *    gender: "Masculino",
 *    address: "Rua Das Flores, 234, Lugar Nenhum - PJ, Guaruba",
 *    phone: "834292384",
 *    email: "gedhean@email.com",
 *    password: "ged123",
 *    isAdmim: true,
 * }
 */
function createUserIfNotExist(userData) {
  const user = User.findOne({ name: userData.name })
  if (!user) {
    console.log('User data:', User.insert(userData))
    console.log('User created')
  } else {
    console.log('User already exist!', user)
  }
}
/**
 * Find one user
 * @param {object} query Query object Mongo-like
 * @returns user
 */
function findUser(query) {
  return User.findOne(query)
}

function saveCv(userEmail, cvHtml) {
  Cv.findAndRemove({ owner: userEmail })
  const cv = Cv.insertOne({ owner: userEmail, cvHtml })
  console.log('Saving cv on db...', cv.owner)
  console.log('User cvs:', Cv.find().length)
}

function findCv(userEmail) {
  return Cv.findOne({ owner: userEmail })
}

// Run
function initDb(params) {
  // Create one admin
  createUserIfNotExist({
    name: 'Gêdhean Alves',
    email: 'gedhean@admin.com',
    password: 'admin123',
    isAdmin: true
  })
  createUserIfNotExist({
    name: 'Clarlos Cesar',
    age: 43,
    gender: 'Masculino',
    address: 'Rua bla bla, 123',
    phone: '232121321321',
    email: 'carlos@email.com',
    password: 'ged123',
    isAdmin: false
  })
  createUserIfNotExist({
    name: 'Ana Cesar',
    age: 33,
    gender: 'Feminina',
    address: 'Rua blau blau, 1123',
    phone: '9999999999',
    email: 'ana@email.com',
    password: 'ana123',
    isAdmin: false
  })
  const users = User.find()
  console.log('Initial users:', users)
}

module.exports = {
  db,
  User,
  createUserIfNotExist,
  findUser,
  saveCv,
  findCv
}
