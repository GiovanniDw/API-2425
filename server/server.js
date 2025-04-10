import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'

import { renderTemplate, render } from './utils/renderTemplate.js'
import {data} from './data.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'


export const app = new App()

export const engine = new Liquid({
  root: path.join(__dirname, '../views/'), // Set root directory for templates
  extname: '.liquid', // Set default file extension
})

app.engine('liquid', engine.renderFile.bind(engine))
app.set('views', path.join(__dirname, '../views/'))
app.set('view engine', 'liquid')


app.use(logger())
app.use('/', sirv('dist'))
app.use('/', sirv('public'))

app.locals.node = process.env.NODE_ENV
// app.locals.email = "me@myapp.com";




app.get('/', async (req, res) => { 
  const pageData = {
    title: 'Home',
    items: Object.values(data),
  }

  return render(res, 'index', pageData)
})


app.get('/login', async (req, res) => {
  const pageData = {
    title: 'Login',
    items: Object.values(data),
  }

  return render(res, 'login', pageData)
})

app.get('/register', async (req, res) => {
  const pageData = {
    title: 'Register',
    items: Object.values(data),
  }

  return render(res, 'register', pageData)
})

app.get('/plant/:id/', async (req, res) => {
  const id = req.params.id
  const item = data[id]

  const pageData = {
    title: `Detail page for ${id}`,
    item,
  }

  if (!item) {
    return res.status(404).send('Not found')
  }
  return render(res, 'detail', pageData)
})


app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  res.locals.user = req.user
  res.locals.authenticated = !req.user.anonymous
  next()
})



app.listen(PORT, () => console.log(`Server available on ${BASE_URL}:${PORT}`))
