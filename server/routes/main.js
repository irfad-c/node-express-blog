const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

//GET
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Simple blog created with NodeJS,ExpressJS and MongoDB",
    };
    //How many post per page
    let perpage = 10;
    //current page number
    //req.query.page gets the page number from URL: / ?page=2.
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      //Skip post from previous page
      .skip(perpage * page - perpage)
      //fetch only 10pages
      .limit(perpage);
    //Counts how many total posts exist in the collection.
    const count = await Post.countDocuments();
    //parseInt make it integer
    const nextPage = parseInt(page) + 1;
    //Math.ceil rounds the number obtained after calculating count/perpage
    const hasNextPage = nextPage <= Math.ceil(count / perpage);
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

//GET , Post id
//Accepts a blog post ID in the URL.
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    //Looks up that post in MogoDB using findById.
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple blog created with NodeJS,Express & MongoDB",
      currentRoute: `/post/${slug}`,
    };
    res.render("post", { locals, data, currentRoute });
  } catch (error) {
    console.log(error);
  }
});

//POST
//post-searchTerm

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "A small blog app using node",
    };
    let searchTerm = req.body.searchTerm;
    //This regex /[^a-zA-Z0-9]/g removes all characters that are not letters or numbers.
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
      //Find me documents where either the title OR the body contains the search term
      $or: [
        //$rgex stands for regular expression search.
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;

/* router.post("/search", async (req, res) => {
  const locals = {
    title: "Search",
    description: "A small blog app using node",
  };

  try {
    const data = await Post.find();
    res.render("search", { locals, data });
  } catch (error) {
    console.log(error);
  }
}); */

/* function insertPostData() {
  Post.insertMany([
    {
      title: "Building APIs with Node.js",
      body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
    },
    {
      title: "Deployment of Node.js applications",
      body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
    },
    {
      title: "Authentication and Authorization in Node.js",
      body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
    },
    {
      title: "Understand how to work with MongoDB and Mongoose",
      body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
    },
    {
      title: "build real-time, event-driven applications in Node.js",
      body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
    },
    {
      title: "Discover how to use Express.js",
      body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
    },
    {
      title: "Asynchronous Programming with Node.js",
      body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
    },
    {
      title: "Learn the basics of Node.js and its architecture",
      body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
    },
    {
      title: "NodeJs Limiting Network Traffic",
      body: "Learn how to limit netowrk traffic.",
    },
    {
      title: "Learn Morgan - HTTP Request logger for NodeJs",
      body: "Learn Morgan.",
    },
  ]);
}

insertPostData(); */
