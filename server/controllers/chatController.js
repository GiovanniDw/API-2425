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

export const chatSocket = async (req, res, next) => {   
  if (req.ws) {
    const ws = await req.ws()

    connections.push(ws)

    ws.on('message', (message) => {
      console.log('Received message:', message.toString())

      // broadcast
      // biome-ignore lint/complexity/noForEach: <explanation>
      connections.forEach((socket) => socket.send(message))
    })

    ws.on('close', () => (connections = connections.filter((conn) => conn !== ws)))
  }

}


export const createChatRoom = async (req, res) => {


  const { name, icon, description } = req.body
  console.log('req.body:', req.body)
  console.log('roomName:', name)
  if (!name) {
    return res.status(400).send('Room name is required')
  }

  // Create a new chat room in the database
  // const newRoom = await createChatRoom(roomName)
  // return res.status(201).json(newRoom)

}