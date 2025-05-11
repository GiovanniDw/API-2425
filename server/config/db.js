import mongoose from 'mongoose'

const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL_START = process.env.DB_URL_START
const DB_URL_END = process.env.DB_URL_END

const DB_URL = `${DB_URL_START}${DB_USER}:${DB_PASS}${DB_URL_END}`

export const db = () => {
  try {
    const conn =  mongoose.connect(DB_URL)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1) // process code 1 code means exit with failure, 0 means success
  }
}
