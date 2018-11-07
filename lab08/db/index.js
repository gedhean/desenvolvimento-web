const path = require('path')
const Loki = require('lokijs')

const db = new Loki(path.join(__dirname,'database.json'), {
  autosave: true,
  autoload: true,
  verbose: true,
  autosaveInterval: 3000
})

const User = db.addCollection('user')
/**
 * Create a user if not exist
 * @param {object} userData User data
 * @example
 * {
 *    name: "Gedhean Alevs",
 *    age: 23,
 *    gender: Masculino,
 *    address: "Rua Das Flores, 234, Lugar Nenhum - PJ, Guaruba",
 *    login: "gedhean",
 *    password: "ged123",
 *    isAdmim: true,
 *    email: "gedhean@email.com",
 *    phone: "834292384"
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

module.exports = {
  db,
  User,
  createUserIfNotExist
}
