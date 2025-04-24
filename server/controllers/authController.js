import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

import { app } from '../server.js'

const maxAge = 24 * 60 * 60

const createJWT = (id) => {
  return jwt.sign({ id }, 'chatroom secret', {
    expiresIn: maxAge, // in token expiration, calculate by second
  })
}

const alertError = (err) => {
  let errors = { name: '', username: '', password: '' }
  console.log('err message', err.message)
  console.log('err code', err.code)

  if (err.message === 'Incorrect email') {
    errors.username = 'This email not found!'
  }
  if (err.message === 'Incorrect password') {
    errors.password = 'The password is incorrect!'
  }
  if (err.code === 11000) {
    errors.username = 'This email already registered'
    return errors
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}

export const register = async (req, res, next) => {
  if (req.body) {
    console.log('req.body')
    console.log(req.body)
  }

  let pageData = {
    title: 'Register',
  }
  try {
    render(req, res, 'register', pageData)
  } catch (err) {
    let pageData = {
      title: 'Register',
      error: { message: err },
    }
    render(req, res, 'register', pageData)
  }
}

export const doRegister = async (req, res, next) => {
  if (req.body) {
    console.log('req.body')
    console.log(req.body)
  }
  console.log('doRegister')

  let pageData = {
    title: 'Register',
  }
  
  let { username, name, password } = req.body
  try {
    let newUser = {
      username: username,
      email: username,
      name: name,
      password: password,
    }
  

    let user = await User.create(newUser)
  
    let token = createJWT(user._id)
    console.log('token')
    console.log(token)
    // create a cookie name as jwt and contain token and expire after 1 day
    // in cookies, expiration date calculate by milisecond
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.status(201).json({ user });

    console.log('user')
    console.log(user)

    req.session.isLoggedIn = true
    req.session.user = user

    res.redirect('/')
  } catch (error) {
    let errors = alertError(error)
    console.log('errors')
    console.log(errors)
    // res.status(400).json({ errors });

    let pageData = {
      title: 'Register',
      error: errors,
    }
    render(req, res, 'register', pageData)
    // next(error);
  }
}

export const login = async (req, res, next) => {
if (req.session.isLoggedIn) {
  res.redirect('/chat')
} 
  if (req.params) {
    console.log('req.params')
    console.log(req.params)
  }
  if (req.session) {
    console.log('session:', req.session)
    console.log('session:req.session.user')
    console.log(req.session.user)
  }
  // const { username, email, password, name, id } = req.body
  const pageData = {
    title: 'Login',
  }
  try {
    render(req, res, 'login', pageData)
  } catch (err) {
    pageData.error = { message: err }
    render(req, res, 'login', pageData)
    next(err)
  }
}

export const isLoggedIn = async (req, res, next) => {
  if (req.session.user || req.session.isLoggedIn) {
    next()
  } else {
console.log('req.route.path')
    console.log(req.route.path)
    // const query = queryString.stringify({
    //   url: req.originalUrl,
    // })
     //save the route/url the user wants to visit en make a querystring
    // sends the user to the login page and adds the orignal url as query
    res.status(403).redirect('/login?' + new URLSearchParams({ url: req.originalUrl })) 
  }
}





export const doLogin = async (req, res, next) => {
  let { username, password } = req.body

  const pageData = {
    title: 'Login',
  }

  console.log('doLogin')
  console.log(req.body)
  try {
    const user = await User.login(username, password)
    let token = createJWT(user._id)
    console.log('user token')
    console.log(token)
    console.log('user')
    console.log(user)

    if (user) {
      req.session.isLoggedIn = true
      req.session.user = user

      app.locals.isLoggedIn = true
      app.locals.user = user
    }

    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    // req.session.isLoggedIn = true
    // req.session.user = user
    res.status(201).redirect(req.query.url || '/')

    // res.redirect('/')
  } catch (error) {
    let errors = alertError(error)

    pageData.error = errors
    render(req, res, 'login', pageData)

    // res.status(400).json({ errors })
  }
}





export const doLoginOLD = async (req, res, next) => {
  const { username, email, password, name, id } = req.body
  User.findByUsername(username, password, function (err, user) {
    if (err) {
      res.json({
        success: false,
        message: 'Can Not Login. Error: ' + err,
      })
    } else {
      req.login(user, (er) => {
        if (er) {
          res.json({ success: false, message: er })
        } else {
          res.redirect('/')
          next()
        }
      })
    }
  })
}

export const doRegisterNo = async (req, res) => {
  const { username, email, password, name, id } = req.body
  User.register(
    new User({
      username: req.body.username,
      email: req.body.username,
      name: req.body.name,
      id: id,
    }),
    password,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: 'Your account could not be saved. Error: ' + err,
        })
      } else {
        req.login(user, (er) => {
          if (er) {
            res.json({ success: false, message: er })
          } else {
            res.redirect('/')
          }
        })
      }
    }
  )
}
