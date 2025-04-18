import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'
import getSession from 'next-session'
import mongoose from 'mongoose'
import { urlencoded, json } from 'milliparsec'
import multer from 'multer'
import { renderTemplate, render } from './utils/renderTemplate.js'
import { data } from './data.js'
import { doLogin, doRegister, login, register } from './controllers/authController.js'
import passport from './middleware/passport.js'



import mongo from './middleware/mongo.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const upload = multer()

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

const DB_URL_START = process.env.DB_URL_START
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL_END = process.env.DB_URL_END

const DB_URL = `${DB_URL_START}${DB_USER}:${DB_PASS}${DB_URL_END}`

const secretToken = process.env.SECRET_TOKEN
const sessionSecret = process.env.SESSION_SECRET

console.log('DB_URL:', DB_URL)

export const app = new App({
  onError: (err, req, res) => {
    res.status(500).send({
      message: err.message,
    })
  },
})
app.use(logger())
app.use(json())
app.use(
  urlencoded({
    extended: true,
    credentials: true,
  })
)
app.use(async (req, res, next) => {
  req.session = await getSession({
    secret: sessionSecret,
  })(req, res)
  next()
})


export const engine = new Liquid({
  root: path.join(__dirname, '../views/'), // Set root directory for templates
  extname: '.liquid', // Set default file extension
})

const renderLiquid = (path, _, options, cb) => engine.renderFile(path, options, cb)


app.engine('liquid', engine.renderFile.bind(engine))
app.set('views', path.join(__dirname, '../views/'))
app.set('view engine', 'liquid')


app.use('/', sirv('dist'))
app.use('/', sirv('public'))

app.locals.node = process.env.NODE_ENV
// app.locals.email = "me@myapp.com";

//  passport(app)


app.use((req, res, next) => {
  console.log('Request Body:', req.body)
  next()
})

app.get('/', async (req, res, next) => {
  console.log('home')
  if (req.user) {
    console.log('user:', req.user)
  }

  try {
    const pageData = {
      title: 'Home',
      items: Object.values(data),
    }

  return  render(res, 'login', pageData)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.get('/login', login)
app.use('/login', urlencoded())
app.post('/login', doLogin)

app.get('/register', register)

app.use('/register', urlencoded())

app.post('/register', upload.array(), doRegister)

// app.get('/plant/:id/', async (req, res) => {
//   const id = req.params.id
//   const item = data[id]

//   const pageData = {
//     title: `Detail page for ${id}`,
//     item,
//   }

//   if (!item) {
//     return res.status(404).send('Not found')
//   }
//   return render(res, 'detail', pageData)
// })

// app.use((req, res, next) => {
//   console.log('Make `user` and `authenticated` available in templates')
//   // Make `user` and `authenticated` available in templates
//   res.locals.user = req.user
//   res.locals.authenticated = !req.user.anonymous
//   next()
// })

mongo()
  .then(() => {
    console.log('mongo connected')
    app.listen(PORT, () => {
      console.log(`Server available on ${BASE_URL}:${PORT}`)
    })
  })
  .catch((err) => {
    // an error occurred connecting to mongo!
    // log the error and exit
    console.error('Unable to connect to mongo.')
    console.error(err)
  })
