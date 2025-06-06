import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'

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

// Initialize Liquid engine
export const engine = new Liquid({
  root: path.join(__dirname, '../views/'), // Set root directory for templates
  extname: '.liquid', // Set default file extension
})

// Create a TinyHTTP app
const app = new App()

// Middleware setup
app.use(logger())
app.use('/', sirv('dist', { dev: true }))
app.use('/', sirv('public', { dev: true }))

// Custom render function to integrate LiquidJS
function render(res, view, data) {
  engine
    .renderFile(view, data)
    .then((html) => {
      res.send(html)
    })
    .catch((err) => {
      res.status(500).send(`Error rendering template: ${err.message}`)
    })
}

// Define routes
app.get('/', (req, res) => {
  const pageData = {
    title: 'Home',
    items: Object.values(data),
  }

  // Use the custom render function
  return render(res, 'index', pageData)
})

app.get('/plant/:id/', (req, res) => {
  const id = req.params.id
  const item = data[id]

  const pageData = {
    title: `Detail page for ${id}`,
    item,
  }

  if (!item) {
    return res.status(404).send('Not found')
  }

  // Use the custom render function
  render(res, 'detail', pageData)
})

// Start the server
app.listen(PORT, () => console.log(`Server available on ${BASE_URL}:${PORT}`))
