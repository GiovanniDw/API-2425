import User from '../models/User.js'
import Room from '../models/Room.js'
import Message from '../models/Message.js'

import { render } from '../utils/renderTemplate.js'

export const getChatRoomsList = async () => {
  return await Room.find({}).then((rooms) => {
    const roomsList = []
    rooms.forEach((room) => {
      roomsList.push({
        id: String(room._id),
        name: room.name,
        icon: room.icon,
        description: room.description,
      })
    })
    return roomsList
  })
}

export const getChatRoomById = async (id) => {
  try {
    const room = await Room.findById(id)

    const roomInfo = {
      id: String(room._id),
      name: room.name,
      icon: room.icon,
      description: room.description,
    }
    return roomInfo
  } catch (err) {
    console.log(err)
  }
}
