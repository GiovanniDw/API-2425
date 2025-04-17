import { render } from '../utils/renderTemplate.js'
import User from '../models/User.js'

export const register = async (req, res, next) => {
  let pageData = {
    title: 'Register',
  }
  try {
    return render(res, 'register', pageData)
  } catch (err) {
    pageData = {
      title: 'Register',
      error: { message: err },
    }
    return render(res, 'register', pageData)
  }
}

export const doRegister = (req, res, next) => {
  const { username, email, password, name, id } = req.body
  User.register(
    new User({
      username: req.body.username,
      email: req.body.username,
      name: req.body.name,
      id: id,
    }),
    username,
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

export const login = async (req, res, next) => {
  // const { username, email, password, name, id } = req.body
  let pageData = {
    title: 'Login',
  }
  try {
    render(res, 'login', pageData)
    next()
  } catch (err) {
    pageData.error = { message: err }
    render(res, 'login', pageData)
    next(err)
  }
}

export const doLogin = (req, res, next) => {
  const { username, email, password, name, id } = req.body
  User.findByUsername(username, username, function (err, user) {
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
