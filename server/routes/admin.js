const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
//bcrypt is a library for hashing passwords
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

//GET , Admin - Login Page
router.get("/admin", async (req, res) => {
  try {
    //JS object
    const locals = {
      title: "Admin",
      description: "Simple Blog",
    };
    //taking all the blog posts from the posts collection
    const data = await Post.find();
    //index.ejs is rendered inside admin folder
    //Use adminLayout as the layout template.
    //here adminLayout come from admin.ejs.index.ejs will be wraped inside this admin.ejs
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//POST, Admin - Check Login
router.post("/admin", async (req, res) => {
  try {
    //object destructutring
    //const username=req.body.username
    //take values from login form
    const { username, password } = req.body;
    //find user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //create JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    //save token into cookies
    //httpOnly: true → makes it inaccessible to JavaScript (safer).
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Check Login
const authMiddleware = (req, res, next) => {
  //Get token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized -1" });
  }
  try {
    //verify the token using jwtSecret
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - 2" });
  }
};

//GET ,Admin Dashboard
//With authMiddleware only the user who has the JWT token can access the dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple blog created with NodeJS,ExpressJS and MongoDB",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//GET ,Admin - Create New Post

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add post",
      description: "Simple blog created with NodeJS,ExpressJS and MongoDB",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//POST ,Admin - Create New Post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
    });

    await newPost.save(); // saves post to MongoDB
    res.redirect("/dashboard");
  } catch (error) {
    console.log("Error while creating post:", error);
    res.status(500).send("Something went wrong while creating the post");
  }
});

//GET ,Admin - Create New Post

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit post",
      description: "Free NodeJS user management system ",
    };
    //req.params.id → the actual post’s _id from the URL.
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//PUT ,Admin - Create New Post

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

//POST, Admin - Register
router.post("/register", async (req, res) => {
  try {
    //Extract username and password from the request body
    const { username, password } = req.body;
    //Hashes(encrypts)the password
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      //Saves new user into MongoDB
      const user = await User.create({ username, password: hashedPassword });
      //status() sets the HTTP status code,201 means created
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      //11000 is the special code number for error.It happens when we try to insert a unique document,but that document (email,userId..)already exist in the mongoDB database.
      if (error.code === 11000) {
        //409 conflict
        res.status(409).json({ message: "user already in use" });
      }
      //500 internal server error
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

//Delete,Admin-Delete Post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//GET , admin logout

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //res.json({ message: "Logout successful" });
  res.redirect("/");
});

module.exports = router;
/* //POST , Admin - Check Login

router.get("/dashboard", authMiddleware, async (req, res) => {
  res.render("admin/dashboard");
});
 */
