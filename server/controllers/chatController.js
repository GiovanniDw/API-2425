import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Room from '../models/Room.js'; 
import Message from '../models/Room.js' 


export const chat = async (req, res, next) => {
  if (req.session) {
    console.log('session:', req.session)
    console.log('session:req.session.user')
    console.log(req.session.user)
  }
let roomsList = []
  let Rooms = await Room.find()
  
  

  // const { username, email, password, name, id } = req.body
  



let pageData = {
  title: 'Chat',
  rooms: Object.keys(roomsList),
}

  try {
    console.log('typeof Rooms')    
console.log(typeof Rooms)
    
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


export const createChatRoom = async (req, res, next) => {


  const { name, icon, description } = req.body
  console.log('req.body:', req.body)
  console.log('roomName:', name)
  if (!name) {
    return res.status(400).send('Room name is required')
  }
try {

  const roomExists = await Room.findOne({ name: name })
  if (roomExists) {
    throw new Error('Room Name already exists')
    // // pageData.error = { message: 'User already exists' };

    // pageData.error = { message: 'User already exists' }
    // return render(req, res, 'register', pageData)
  }


  let newRoom = {
    name: name,
    icon:icon,
    description: description,
  }
  let room = await Room.create(newRoom)
} catch (err) {
  next(err)
}


  // Create a new chat room in the database
  // const newRoom = await createChatRoom(roomName)
  // return res.status(201).json(newRoom)

}


export const getChatRoom = async (req, res, next) => {
  const pageData = {
    title: 'Home',
  }
  try {
    return render(req, res, 'profile', pageData)
  } catch (error) {
    console.log(error)
    next(error)
  }
}