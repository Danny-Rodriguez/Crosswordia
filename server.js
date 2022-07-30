const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const exphbs = require("express-handlebars")
const passport = require("passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const connectDB = require("./config/db")
const router = express.Router()

const bodyParser = require("body-parser")
const Confirmation = require("./models/Confirmation")

// Load config
dotenv.config({ path: "./config/config.env" })

//passport config
require("./config/passport")(passport)

connectDB()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

router.post("/crossword", (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

app.use("/crossword", router)

//test
router.post("/user", (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

// router.post("/solve", (req, res) => {
//   res.send(req.body)
// })

// app.use("/user", router)

// const { formatName, checkIf, ifCond } = require("./helpers/hbs")

app.engine(
  ".hbs",
  exphbs.engine({
    // helpers: {
    //   formatName,
    //   checkIf,
    //   ifCond
    // },
    defaultLayout: "main",
    extname: "hbs"
  })
)
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
// app.use("/solve", require("./routes/index"))
app.use("/login", require("./routes/index"))
app.use("/user", require("./routes/user"))
app.use("/crossword", require("./routes/index"))
// app.use("/:id", require("./routes/solve"))
// app.use("/:id/fetch", require("./routes/solve"))
app.all("*", (req, res) => {
  res.status(404)
  res.render("error/404", {
    layout: "mainGuest"
  })
})

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
