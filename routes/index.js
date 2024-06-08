var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./post');
const passport = require('passport');
const upload = require("./multer")

const localstrategy = require("passport-local");
passport.use(new localstrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', );
})
router.get('/home', function(req, res, next) {
  res.render('home' );
});

router.get('/login', function(req, res){
  res.render('login',{error: req.flash('error')});
})
router.get('/feed', function(req, res){
  res.render('feed')
})
router.post('/upload',isLoggedIn, upload.single("file"), async (req, res, next)=> {
  if(!req.file && !req.filecaption){
    // res.render('profile', {error1: "Something went wrong"})
    res.status(400).send("Something went wrong.")
  }
  else{
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    const postdata = await postModel.create({
        image: req.file.filename,
        postText: req.body.filecaption,
        user: user._id
    })
    
    user.posts.push(postdata._id)
    await user.save();
    res.redirect("/profile")
  }
  
});

router.get('/profile',isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts");
  // console.log(user);

  res.render('profile', {user})
})


router.post('/register', function(req, res){
  const {username, email, fullname} = req.body;

  const userdata = new userModel({ username,email,fullname });
  userModel.register(userdata, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    })
  })
})


router.post('/login',passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}) ,function(req, res){
})

router.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  res.redirect("/login")
}



// router.get('/alluserposts', async function(req, res, next) {
//   let user = await userModel.findOne({_id: "6648929000e5811ccefd78b9"})
//   .populate('posts')
//   res.send(user)
// });


// router.get('/createuser', async function(req, res, next) {
//   const createduser = await userModel.create({
//     username: "Aniket",
//   password: "Ani12",
//   posts:  [],
//   email:"anikert@123mail",
//   fullname:"Aniket Sharma"
//   })
//   res.send(createduser);
// });

// router.get('/createpost', async function(req, res, next) {
//     const createdpost = await postModel.create({
//       postText:"Hello everyOne this is second created post",
//       user: "6648929000e5811ccefd78b9",
//   });
//   let user = await userModel.findOne({_id: "6648929000e5811ccefd78b9"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("Done")
//   res.send(createdpost)
// })


module.exports = router;
