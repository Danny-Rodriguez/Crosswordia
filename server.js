const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectDB, resolveMongoUri } = require("./config/db");

const bodyParser = require("body-parser");

// Load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

async function start() {
  const mongoUri = await resolveMongoUri();
  await connectDB(mongoUri);

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const PORT = process.env.PORT || 3000;

  //Handbars Helpers
  const { dateF, linkF } = require("./config/helpers/hbs");

  app.engine(
    ".hbs",
    exphbs.engine({
      helpers: { dateF, linkF },
      defaultLayout: "main",
      extname: "hbs",
      layoutsDir: __dirname + "/views/layouts/",
      partialsDir: __dirname + "/views/partials/",
    }),
  );
  app.set("view engine", ".hbs");

  // Sessions
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: mongoUri }),
    }),
  );

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Set Global Var
  app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    app.locals.footer = new Date().getFullYear();
    if (req.isAuthenticated()) {
      app.locals.image = req.user.image;
    }
    next();
  });

  //Static folder
  app.use(express.static(path.join(__dirname, "public")));

  //Routes
  if (process.env.E2E === "true") {
    app.use("/__test__", require("./routes/testAuth"));
  }
  app.use("/", require("./routes/index"));
  app.use("/create", require("./routes/index"));
  app.use("/auth", require("./routes/auth"));
  app.use("/solve", require("./routes/solve"));
  app.use("/login", require("./routes/index"));
  app.use("/user", require("./routes/user"));
  app.use("/crossword", require("./routes/index"));
  app.use("/dictionary", require("./routes/index"));
  app.use("/gallery", require("./routes/index"));
  app.use("/about", require("./routes/index"));
  app.all("*", (req, res) => {
    let layoutValue;
    req.isAuthenticated()
      ? (layoutValue = "main")
      : (layoutValue = "mainGuest");
    res.status(404);
    res.render("error/404", {
      layout: layoutValue,
      title: "404 | Crosswordia",
    });
  });

  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    ),
  );
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
