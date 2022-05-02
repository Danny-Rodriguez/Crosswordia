const express = require("express") // create basic express server
const exphbs = require("express-handlebars") // create express-handlebars
const path = require("path")
const dotenv = require("dotenv") // store config of code environment

const app = express()
const PORT = process.env.PORT || 3000 // process.env navigates variables in config.env

// Handlebars
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }))
// set ".hbs" as handlebars" extension
// set default layout as "main" (views/layouts/main.hbs)

app.set("view engine", ".hbs")

app.use(express.static(path.join(__dirname + "/public")))
app.use("/", require("./routes/index"))
app.use("/create", require("./routes/create"))

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
