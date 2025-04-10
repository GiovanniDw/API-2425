export const register = async (req, res, next) => {
  try {
    let data = {
      layout: 'base.njk',
      title: 'Welcome',
    }

    res.render('register.njk', data)
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.njk',
    }
    res.render('register.njk', data)
    next()
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
            res.redirect('/course/start')
          }
        })
      }
    }
  )
}
