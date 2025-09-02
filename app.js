//---Environment set up
//Loads variables from .env file (like PORT, MONGODB_URI) into process.env.
require("dotenv").config();

//---Imports
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");
const session = require("express-session");

//---Server setup
const app = express();
//PORT not port
const port = process.env.PORT || 5000;
connectDB();

//---Middleware
//express.urlencoded used to parse form data which comes from an HTML form.
//extended:true - qs library used to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

//---Session handling
//It lets your server remember data about a user across requests.
app.use(
  session({
    //A random ID used to sign the session ID cookie
    secret: "keyboard cat",
    //Session saves only when something changes
    resave: false,
    //Saves a new session even if it is empty
    saveUninitialized: true,
    //This line is from your session configuration in Express when you use connect-mongo to store session data in MongoDB instead of keeping it in memory.
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie:{maxAge:new Date (Date.now()+(3600000)}
  })
);

//---Static&View Engine
//For static files look public folder
app.use(express.static("public"));
//Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
//This tells Express to use EJS (Embedded JavaScript) as the template engine.Express by default  searches in views  folder for .ejs files.Whenever I use res.render() I want to render ejs file.
app.set("view engine", "ejs");

//---Helpers&Routers
//In Express, app.locals is an object where you can store variables or functions.Everything inside app.locals is automatically available to all your EJS views without needing to pass it manually in every res.render().
app.locals.isActiveRoute = isActiveRoute;
//app.use tells the express to use middleware or router
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

//---Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
