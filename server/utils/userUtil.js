import User from '../models/User.js'

export const addUserInfo = (userID, avatar, bio) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newInfo = {
        avatar: avatar,
        bio: bio,
      }
      const user = await User.findById(userID)

      const checkAvatar = await user.avatar
      const checkBio = await user.bio

      if (!checkAvatar) {
        user.avatar = avatar
        await user.save()
      }
      if (!checkBio) {
        user.bio = bio
        await user.save()
      }

      resolve('has resolved')
    } catch (err) {
      reject(err)
    }
  })
}
