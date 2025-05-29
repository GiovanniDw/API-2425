import { render } from '../utils/renderTemplate.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Room from '../models/Room.js'
import Message from '../models/Room.js'
import { getChatRoomById, getChatRoomsList } from '../utils/chatUtil.js'

export const chat = async (req, res, next) => {
  if (req.session) {
    console.log('session:', req.session)
    console.log('session:req.session.user')
    console.log(req.session.user)
  }
  const roomsList = await getChatRoomsList()

  // await Room.find({}).then((rooms) => {
  //   rooms.forEach((room) => {
  //     roomsList.push({
  //       id: room._id,
  //       name: room.name,
  //       icon: room.icon,
  //       description: room.description,
  //     })
  //   })
  // })

  // const { username, email, password, name, id } = req.body

  let pageData = {
    title: 'Chat',
    rooms: roomsList,
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
      icon: icon,
      description: description,
    }
    let room = await Room.create(newRoom)

    res.redirect(`/chat/${room._id}`)
    // return res.status(201).json(room)
  } catch (err) {
    next(err)
  }

  // Create a new chat room in the database
  // const newRoom = await createChatRoom(roomName)
  // return res.status(201).json(newRoom)
}

export const getChatRoom = async (req, res, next) => {
  const roomsList = await getChatRoomsList()
  const id = req.params.id
  const room = await getChatRoomById(id)
  console.log('room:', room)
  let pageData = {
    title: room.name,
    room: room,
    rooms: roomsList,
    slug: String(id),
  }
  try {
    if (!room) {
      return res.status(404).send('Room not found')
    }

    return render(req, res, 'chat', pageData)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
