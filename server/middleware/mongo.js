import mongoose from 'mongoose'
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL_START = process.env.DB_URL_START
const DB_URL_END = process.env.DB_URL_END

const DB_URL = `${DB_URL_START}${DB_USER}:${DB_PASS}${DB_URL_END}`



export default async () => {
  mongoose.Promise = global.Promise
  return mongoose.connect(DB_URL, {
      dbName: process.env.DB_NAME,
    })
}

