var express = require("express");
var router = express.Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("./users");
const postModel = require("./post");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { nav: true, auth: req.isAuthenticated() });
});

//register
router.get("/signup", (req, res) => {
  res.render("signup", { nav: false });
});

router.post("/register", async function (req, res, next) {
  let { username, email, contact, name } = req.body;

  const data = new userModel({
    username,
    email,
    contact,
    name,
  });

  await userModel.register(data, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});
router.get("/profile", isloggedin, async (req, res) => {
  try {
    let user = await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts"); // Make sure this is correct

    console.log(user); // This should show the user object with populated posts in the console
    res.render("profile", { user, nav: true, auth: req.isAuthenticated() });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.redirect("/");
  }
});

router.get("/add", isloggedin, async (req, res) => {
  let user = await userModel.findOne({ username: req.session.passport.user });

  res.render("add", { user, nav: true, auth: req.isAuthenticated() });
});

router.get("/show/post", isloggedin, async (req, res) => {
  let user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("show", { user, nav: true, auth: req.isAuthenticated() });
});

router.get("/about", function (req, res, next) {
  res.render("about", { nav: true, auth: req.isAuthenticated() });
});
router.post(
  "/createPost",
  isloggedin,
  upload.single("postimage"),
  async (req, res) => {
    try {
      let user = await userModel.findOne({
        username: req.session.passport.user,
      });
      const post = await postModel.create({
        user: user._id,
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
      });

      user.posts.push(post._id);
      await user.save();
      res.redirect("/profile");
    } catch (error) {
      console.error("Error creating post:", error);
      res.redirect("/add");
    }
  }
);

router.post(
  "/fileupload",
  isloggedin,
  upload.single("image"),
  async function (req, res, next) {
    let user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);
router.get("/login", (req, res) => {
  res.render("login", { nav: false });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
