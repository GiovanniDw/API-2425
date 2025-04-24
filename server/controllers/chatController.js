import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const chat = async (req, res, next) => {
  if (req.session) {
    console.log('session:', req.session)
    console.log('session:req.session.user')
    console.log(req.session.user)
  }
  // const { username, email, password, name, id } = req.body
  const pageData = {
    title: 'Chat',
  }
  try {
    render(req, res, 'chat', pageData)
  } catch (err) {
    pageData.error = { message: err }
    render(req, res, 'chat', pageData)
    // next(err)
  }
}