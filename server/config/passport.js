import session from 'micro-session'
import { cookieParser } from '@tinyhttp/cookie-parser'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
// import LocalStrategy from 'passport-local-mongoose';

import User from '../models/User.js'

const newLocalStrategy = LocalStrategy.Strategy
// const newMongoStore = MongoStore(session)

export default function (app) {
  console.log('pass')

  app.use(cookieParser(process.env.SESSION_SECRET))
  // app.use(cookieSession({
  // 	keys: [process.env.SESSION_SECRET, 'key2']
  // }))
  console.log('session')
  app.use(
    session({
      // this should be changed to something cryptographically secure for production
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // automatically extends the session age on each request. useful if you want
      // the user's activity to extend their session. If you want an absolute session
      // expiration, set to false
      rolling: true,
      name: 'localhost',
      // set your options for the session cookie
      cookie: {
        httpOnly: false,
        sameSite: false,
        // the duration in milliseconds that the cookie is valid
        maxAge: 60 * 60 * 1000, // 20 minutes
        // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
        // recommended you use this setting in production if your site is published using HTTPS
        // secure: true,
      },
    })
  )

  const authUser = (user, password, done) => {
    //Search the user, password in the DB to authenticate the user
    //Let's assume that a search within your DB returned the username and password match for "Kyle".
    return done(null, authenticated_user)
  }

  passport.use(User.createStrategy())

  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())
  
  // initialize passport. this is required, after you set up passport but BEFORE you use passport.session (if using)
  console.log('pass.init')
  app.use(passport.initialize())
  // only required if using sessions. this will add middleware from passport
  // that will serialize/deserialize the user from the session cookie and add
  // them to req.user
  console.log('pass.session')
  app.use(passport.session())
}

