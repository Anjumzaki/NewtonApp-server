var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const User = require("./models/User");
const Message = require("./models/Message");
const Video = require("./models/Video");
const Transaction = require("./models/Transaction");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require("multer");
const fs = require('fs');
const axios = require('axios');
var app = express();
var cors = require('cors');
app.use(cors());
//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '1000kb' }));

//DB config
const db = require("./config/keys").mongoURI;
//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.use("/getlogo", express.static(__dirname + '/public/carLogos/'));
app.use("/getImages", express.static(__dirname + '/uploads/'));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
app.post('/upload', upload.single('photo'), (req, res, next) => {
  var fn = req.file.filename;
  fs.readFile(req.file.path, (err, contents) => {
    if (err) {
      console.log('Error: ', err);
    }
    else {
      res.status(200)
      res.send(fn).end();
    }
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.use("/getBlogPic", express.static(__dirname + '/uploads/'));

app.put("/add/picId/:id/:fn", async (req, res) => {
  console.log("m", req.params.tId)
  Blog.updateOne({ _id: req.params.id }, {
    $set: {
      picId: req.params.fn
    }
  }, { upsert: true }, function (err, user) {
    res.status(200).send({
      success: 'true',
      message: 'blog updated'
    })
  });
});

app.get('/hello', (req, res) => {
  res.json("Hello Aijaz");
}
);
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//delete blog by id
app.delete('/delete/blog/:id', (req, res) => {

  Blog.findOne({ _id: req.params.id }).then(blog => {
    blog.remove().then(() => res.json({ success: true, message: "blog deleted" }));
  });
}
);
app.delete('/delete/Video/:id', (req, res) => {

  Video.findOne({ _id: req.params.id }).then(blog => {
    blog.remove().then(() => res.json({ success: true, message: "blog deleted" }));
  });
}
);



app.get('/get/oneblog/:id', (req, res) => {

  Blog.findOne({ _id: req.params.id })
    .then(blog => {
      res.json(blog);
    })
    .catch(err => res.status(404).json(err));
}

);

app.get('/get/oneVideo/:id', (req, res) => {

  Video.findOne({ _id: req.params.id })
    .then(blog => {
      res.json(blog);
    })
    .catch(err => res.status(404).json(err));
}

);
//edit register player slot partnerId
app.put("/edit/blog/:id", async (req, res) => {
  console.log("sadddddd", req.params)
  Blog.updateOne({ _id: req.params.id }, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      feature: req.body.feature,
      time: req.body.time,
      blogImage: req.body.imageLink
    }
  }, { upsert: true }, function (err, user) {
    res.status(200).send({
      success: 'true',
      message: 'player edit done'
    })
  });
})
app.put("/edit/video/:id", async (req, res) => {
  console.log("sadddddd", req.params)
  Video.updateOne({ _id: req.params.id }, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      feature: req.body.feature,
      time: req.body.time,
      videoUrl: req.body.imageLink
    }
  }, { upsert: true }, function (err, user) {
    res.status(200).send({
      success: 'true',
      message: 'player edit done'
    })
  });
})

//get all msgs  
app.get("/get/messages", async (req, res) => {
  console.log("call")
  var result = await Message.find().exec();
  res.status(200).send({
    success: 'true',
    message: 'msg get Success',
    result
  })
});

//get all blogs  
app.get("/get/Transaction", async (req, res) => {
  console.log("call")
  var result = await Transaction.find().exec();
  res.status(200).send({
    success: 'true',
    message: 'blog get Success',
    result
  })
});

//get all videos  
app.get("/get/videos", async (req, res) => {
  console.log("call")
  var result = await Video.find().exec();
  res.status(200).send({
    success: 'true',
    message: 'videos get Success',
    result
  })
});


// Register Proccess
app.post('/register', function (req, res) {
  console.log(req.body)

  User.findOne({ userName: req.body.userName })
    .then(response => {
      console.log("check user", response)
      // res.send(response)

      if (response === null) {
        let newUser = new User({
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(function (err) {
              if (err) {
                console.log(err);
                return;
              } else {
                res.send("registered")

              }
            });
          });
        });
      } else {
        res.send("exist")

      }
    })


});

// Login Process
app.post('/login',
  function (req, res) {
    console.log("login req", req.body)

    User.findOne({ userName: req.body.userName })
      .then(response => {
        console.log("resp1", response)

        var pass = response.password;
        console.log("pass", pass)

        bcrypt.compare(req.body.password, response.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            res.send("match")
          } else {
            res.send("wrong")
          }
        })

      })
      .catch(err => res.status(404).json(err));
  }
);



//post msg
app.post('/post/message', async (req, res) => {
  console.log(req.body)
  let msg = new Message({
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    email: req.body.email,
    mobile: req.body.mobile,
    message: req.body.message,
    time: req.body.time
  });
  msg.save(function (err) {
    if (err) {
      console.error(err);
      res.status(200).send({
        success: 'false',
        message: 'msg not post',
        msg,
      })
    } else {
      res.status(200).send({
        success: 'true',
        message: 'msg post',
        msg,
      })
    }
  });
});

//post blog

//post video

//post transaction
app.post('/post/transaction', async (req, res) => {
  console.log(req.body)
  let trans = new Transaction({
    soldDate: req.body.soldDate,
    payDate: req.body.payDate,
    name: req.body.name,
    contact: req.body.contact,
    volume: req.body.volume,
    downPayment: req.body.downPay,
    spiff: req.body.spiff,
    note: req.body.note,
    commission: req.body.commission,
    bonus: req.body.bonus,
    pmdDeduction: req.body.pmdDeduction,
    user: req.body.user
  });

  trans.save(function (err) {
    if (err) {
      console.error(err);
      res.status(200).send({
        success: 'false',
        message: 'transc not post',
        trans,
      })
    } else {
      res.status(200).send({
        success: 'true',
        message: 'transc post',
        trans,
      })
    }
  });

});

// logout
app.get('/logout', function (req, res) {
  req.logout();
  // req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
