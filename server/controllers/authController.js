import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { json } from 'milliparsec'


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
    console.log('req.body');
    console.log(req.body);
  }

  let pageData = {
    title: 'Register',
  }
  try {
     render(res, 'register', pageData)
  } catch (err) {
    let pageData = {
      title: 'Register',
      error: { message: err },
    }
    render(res, 'register', pageData)
  }
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


export const doRegister = async (req, res, next) => {

if (req.body) {
  console.log('req.body')
  console.log(req.body)
}
console.log('doRegister');


  let pageData = {
    title: 'Register',
  }
  console.log('reqbody 1');
  console.log(req.body);
  let { username, name, password } = req.body;
  try {
    let newUser = {
      username: username,
      email: username,
      name: name,
      password: password,
    }
    console.log('newUser');
    console.log(newUser);

    let user = await User.create(newUser);
    console.log('user');
    console.log(user);

    let token =  createJWT(user._id);
    console.log('token');
    console.log(token);
    // create a cookie name as jwt and contain token and expire after 1 day
    // in cookies, expiration date calculate by milisecond
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    // res.status(201).json({ user });

    res.redirect('/');
    next()
  } catch (error) {
    let errors = alertError(error);
    console.log('errors');
    console.log(errors);
    // res.status(400).json({ errors });


  let pageData = {
    title: 'Register',
    error: errors
  }
    render(res, 'register', pageData)
    // next(error);
  }
}

export const login = async (req, res, next) => {
  // const { username, email, password, name, id } = req.body
  let pageData = {
    title: 'Login',
  }
  try {
    render(res, 'login', pageData)
  } catch (err) {
    pageData.error = { message: err }
    render(res, 'login', pageData)
    next(err)
  }
}

export const doLogin = async (req, res, next) => {
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
