import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

import { addUserInfo } from '../utils/userUtil.js'
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
  if (err.message === 'User already exists') {
    errors.username = 'This email already registered'
    return errors
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

    const userExists = await User.findOne({ email: username })
    if (userExists) {

      throw new Error("User already exists")
      // // pageData.error = { message: 'User already exists' };
      
      // pageData.error = { message: 'User already exists' }
      // return render(req, res, 'register', pageData)
    }

if (!userExists) {
  let user = await User.create(newUser)
  let token = createJWT(user._id)

  req.session.isLoggedIn = true
  req.session.user = user

  res.redirect('/register/onboarding')
}

  } catch (error) {
    let errors = alertError(error)
    pageData.error = errors
    render(req, res, 'register', pageData)
  }
}

export const onboarding = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login')
  }

  const pageData = {
    title: 'Onboarding',
  }
  try {
    render(req, res, 'onboarding', pageData)
  } catch (err) {
    pageData.error = { message: err }
    render(req, res, 'onboarding', pageData)
    next(err)
  }
}

export const doOnboarding = async (req, res, next) => {
  const pageData = {
    title: 'Onboarding',
  }
  try {
    console.log('doOnboarding')
    const { _id } = req.session.user

    console.log('req.user')
    console.log(req.user)

    let { avatar, bio } = req.body

    const thisUser = await User.findByIdAndUpdate(_id, { bio: bio, avatar: avatar }, { new: true })
    await thisUser.save()
    // await addUserInfo(thisUser._id, avatar, bio)
    // req.session.user = thisUser
    console.log('thisUser')
    console.log(thisUser)

    req.session.user = thisUser

    res.redirect('/chat')
  } catch (err) {
    console.log('error')
    pageData.error = { message: err }
    render(req, res, 'onboarding', pageData)
    next(err)
  }

}

export const login = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/chat')
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
  
  const pageData = {
    title: 'Login',
  }
  try {
    render(req, res, 'login', pageData)
  } catch (err) {
    pageData.error = { message: err }
    render(req, res, 'login', pageData)
  }
}

export const isAuthenticated = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log('isAuthenticated')
    console.log(req.session.user)
    next()
  } else {
    console.log('isAuthenticated: not logged in')
    return res.redirect('/login')
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
    return res.status(403).redirect('/login?' + new URLSearchParams({ url: req.originalUrl }))
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

    if (!user.bio) {
      return res.status(201).redirect('/register/onboarding')
    }

    res.status(201).redirect(req.query.url || '/chat')

    // res.redirect('/')
  } catch (error) {
    let errors = alertError(error)

    pageData.error = errors
    return render(req, res, 'login', pageData)

    // res.status(400).json({ errors })
  }
}
