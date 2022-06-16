const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
// const morgan = require("morgan")
const exphbs = require("express-handlebars")
// const methodOverride = require("method-override")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const connectDB = require("./config/db")
const router = express.Router()
const crosswordRouter = require("./routes/userLoggedIn")
const bodyParser = require("body-parser")
const Confirmation = require("./models/Confirmation")

// Load config
dotenv.config({ path: "./config/config.env" })

//passport config
require("./config/passport")(passport)

connectDB()

const app = express()

// Body Parser
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use("/userLoggedIn", crosswordRouter)

// Creating a crossword end point
app.post("/crossword", (req, res, next) => {
  console.log(req.body)
  const confirmation = new Confirmation({
    test: req.body.test
  })
  confirmation.save(function (err, post) {
    if (err) {
      return next(err)
    }
    res.json(201, post)
  })
})

// //Method override
// app.use(
//   methodOverride(function (req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       // look in urlencoded POST bodies and delete it
//       let method = req.body._method
//       delete req.body._method
//       return method
//     }
//   })
// )

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"))
// }

const PORT = process.env.PORT || 3000

router.post("/crossword", (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

app.use("/crossword", router)

app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }))
app.set("view engine", ".hbs")

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
  })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set Global Var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

//Static folder
app.use(express.static(path.join(__dirname, "public")))

//Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))
app.use("/solve", require("./routes/solve"))
app.use("/UserLoggedIn", require("./routes/userLoggedIn"))

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
