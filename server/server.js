import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { cors } from '@tinyhttp/cors'
import { cookieParser } from '@tinyhttp/cookie-parser'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'

import { urlencoded, json, multipart } from 'milliparsec'

import nextSession from 'next-session'
const getSession = nextSession();

import { renderTemplate, render } from './utils/renderTemplate.js'
import { data } from './data.js'
import { doLogin, doRegister, login, register, isLoggedIn, onboarding, doOnboarding } from './controllers/authController.js'
import { chat, createChatRoom } from './controllers/chatController.js'
import passport from './config/passport.js'

import mongo from './middleware/mongo.js'
import {db} from './config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  settings: {
    networkExtensions: true,
    bindAppToReqRes: true,
    enableReqRoute: true,

  },
})


const CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*',
  exposedHeaders: '*',
  credentials: true,
  // optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(cors(CorsOptions))
// app.options('*', cors(CorsOptions)) // include before other routes

app.use(logger())
// app.use(json())
app.use(urlencoded())

// app.use(async (req, res, next) => {
//   req.session = await getSession({
//     secret: sessionSecret,
//   })(req, res)
//   next()
// })

app.use(async (req, res, next) => {
  await getSession(req, res) // session is set to req.session
  next()
})

export const engine = new Liquid({
  root: path.join(__dirname, '../views/'), // Set root directory for templates
  extname: '.liquid', // Set default file extension
})

// const renderLiquid = (path, _, options, cb) => engine.renderFile(path, options, cb)

app.engine('liquid', engine.renderFile.bind(engine))
app.set('views', path.join(__dirname, '../views/'))
app.set('view engine', 'liquid')

app.use('/', sirv('dist'))
app.use('/', sirv('public'))

app.locals.node = process.env.NODE_ENV
// app.locals.email = "me@myapp.com";

// passport(app)

// app.use((req, res, next) => {
//   console.log('Request Body:', req.body)
//   next()
// })

app.get('/', async (req, res, next) => {
  const pageData = {
    title: 'Home',
    items: Object.values(data),
  }
  try {
    return render(req, res, 'index', pageData)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.get('/login', login)
app.post('/login', doLogin)

app.get('/register', register)
app.post('/register', doRegister)

app.get('/register/onboarding', onboarding)
app.post('/register/onboarding', doOnboarding)

app.post('/logout', (req, res) => {
    req.session.isLoggedIn = false
    req.session.user = null
  return  res.clearCookie('session').redirect('/login')


    // return res.redirect('/login')
})

app.get('/chat', isLoggedIn, chat)

app.post('/chat/create-room', isLoggedIn, createChatRoom)


app.get('/chat/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id
    console.log('id:', id)
  // const { roomId } = req.params
  // console.log('roomId:', roomId)
  if (!id) {
    return res.status(400).send('Room ID is required')
  }
  // Fetch the chat room from the database
  // const chatRoom = await getChatRoom(roomId)
  // return res.status(200).json(chatRoom)
}

)




app.get('/profile', async (req, res, next) => {
  const pageData = {
    title: 'Home',
  }
  try {
    return render(req, res, 'profile', pageData)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


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


app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status || 500)
    const pageData = {
      title: 'Error',
      error: {
        message: err.message,
        status: err.status,
      },
    }
    render(req, res, 'error', pageData)
  } 
})


// app.listen(PORT, async () => {
//   await db()
//   console.log(`Server available on ${BASE_URL}:${PORT}`)
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

