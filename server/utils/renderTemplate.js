import { Liquid } from 'liquidjs'
import { engine, app } from '../server.js'
// const engine = new Liquid({
//   extname: ".liquid",
// });

export const renderTemplate = (template, data) => {
  const viewPath = `${template}`

  const templateData = {
    NODE_ENV: app.locals.node || 'production',
    ...data,
  }

  return engine.renderFileSync(template, templateData)
}

export async function render(res, view, data) {
  const templateData = {
    NODE_ENV: app.locals.node || 'production',
    locals: Object.values(app.locals),
    ...data,
  }

  console.log('render')
  console.log('view:', view)

  engine
    .renderFile(view, templateData)
    .then((html) => {
      res.send(html)
    })
    .catch((err) => {
      res.status(500).send(`Error rendering template: ${err.message}`)
    })
}
