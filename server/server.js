import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'

import { renderTemplate, render } from './utils/renderTemplate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

const data = {
  beemdkroon: {
    id: 'beemdkroon',
    name: 'Beemdkroon',
    image: {
      src: 'https://i.pinimg.com/736x/09/0a/9c/090a9c238e1c290bb580a4ebe265134d.jpg',
      alt: 'Beemdkroon',
      width: 695,
      height: 1080,
    },
  },
  'wilde-peen': {
    id: 'wilde-peen',
    name: 'Wilde Peen',
    image: {
      src: 'https://mens-en-gezondheid.infonu.nl/artikel-fotos/tom008/4251914036.jpg',
      alt: 'Wilde Peen',
      width: 418,
      height: 600,
    },
  },
}

export const engine = new Liquid({
  root: path.join(__dirname, '../views/'), // Set root directory for templates
  extname: '.liquid', // Set default file extension
})

export const app = new App()

app.use(logger())
app.use('/', sirv('dist'))
app.use('/', sirv('public'))

app.locals.node = process.env.NODE_ENV
// app.locals.email = "me@myapp.com";

app.engine('liquid', engine.renderFile.bind(engine))

app.set('views', path.join(__dirname, '../views/'))

app.set('view engine', 'liquid')

app.get('/', async (req, res) => {
  const pageData = {
    title: 'Home',
    items: Object.values(data),
  }

  return render(res, 'index', pageData)
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

app.listen(PORT, () => console.log(`Server available on ${BASE_URL}:${PORT}`))
