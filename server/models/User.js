import mongoose from 'mongoose'
const Schema = mongoose.Schema
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  id: Number,
  name: String,
  email: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  admin: Boolean,
  info: Object,
  bio: String,
  avatar: String,
})

UserSchema.pre('save', async function (next) {
  // const salt = await bcrypt.genSalt()
  // this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.statics.login = async function (username, password) {
  console.log('loginschema')
  console.log(username + password)
  let user = await this.findOne({ username })
  if (user) {
    console.log(user)
    console.log('compare pass')
    console.log(password)
    console.log(user.password)
    // let isAuthenticated = await bcrypt.compare(password, user.password)
    let isAuthenticated = user.password === password

    console.log('isAuthenticated')
    console.log(isAuthenticated)
    if (isAuthenticated) {
      return user
    } else {
      throw Error('Incorrect password')
    }
  } else {
    throw Error('Incorrect email')
  }
}

// UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema)
export default User
