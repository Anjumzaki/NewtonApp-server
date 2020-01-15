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
const Goal = require("./models/Goal");
const Amount = require("./models/Amount");
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
      console.log("asd", response)
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

                User.findOne({ userName: req.body.userName })
                  .then(response => {
                    res.send({
                      response: response,
                      resp: "registered"
                    })
                    // res.send("registered")
                  })
              }
            });
          });
        });
      } else {
        res.send("exist")
      }
    })


});


// Change password Proccess
app.put('/changePassword', function (req, res) {
  console.log(req.body)

  User.findOne({ _id: req.body.uid })
    .then(response => {
      console.log("check user", response)
      
      var op='';

      bcrypt.compare(req.body.oldPass, response.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
            console.log("Match")
            var nhp='';
           
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(req.body.newPass, salt, function (err, hash) {
                if (err) {
                  console.log(err);
                }
                nhp = hash;

                User.updateOne({
                  _id: req.body.uid,
                }, {
                  $set: {
                    password: nhp
                  }
                }, {
                  upsert: true
                }, function (err, user) {
                  console.log("Match")
      
                  res.send("match")
                });
                
              });
            });

         
        } else {
          console.log("wrong")
          res.send("wrong")
        }
      })
     
    })


});


// Change forgot Password Proccess
app.put('/forgotPassword', function (req, res) {
  console.log(req.body)
  var np=''

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.newPass, salt, function (err, hash) {
      if (err) {
        console.log(err);
      }
      np = hash;
      User.updateOne({ _id: req.body.uid }, {
        $set: {
          password: hash
        }
      }, { upsert: true }, function (err, user) {
        res.status(200).send({
          success: 'true',
          message: 'blog updated'
        })
      });
    });
  });
  
});


// Change change email Proccess
app.put('/changeEmail', function (req, res) {
  console.log(req.body)
      User.updateOne({ _id: req.body.uid }, {
        $set: {
          email: req.body.newEmail
        }
      }, { upsert: true }, function (err, user) {
        res.status(200).send({
          success: 'true',
          message: 'email updated'
        })
      });
  });
  

// Login Process
app.post('/login',
  function (req, res) {
    console.log("login req", req.body)

    User.findOne({$or:[{ userName: req.body.userName},{email: req.body.userName}]})
      .then(response => {
        console.log("resp1", response)

        var pass = response.password;
        console.log("pass", pass)

        bcrypt.compare(req.body.password, response.password, function (err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            res.send({
              response: response,
              resp: "match"
            })
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
    downPayment: req.body.downPayment,
    spiff: req.body.spiff,
    note: req.body.note,
    commission: req.body.commission,
    bonus: req.body.bonus,
    pmdDeduction: req.body.pmdDeduction,
    userId: req.body.userId
  });

  trans.save(function (err) {
    if (err) {
      console.error(err);
      res.status(500).send({
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


//post goals
app.post('/post/goals', async (req, res) => {
  console.log(req.body)
  let goal = new Goal({
    selectedYear: req.body.selectedYear,
    spiff: req.body.spiff,
    volume: req.body.volume,
    commission: req.body.commission,
    bonus: req.body.bonus,
    userId: req.body.userId
  });

  goal.save(function (err) {
    if (err) {
      console.error(err);
      res.status(200).send({
        success: 'false',
        message: 'goal not post',
        goal,
      })
    } else {
      res.status(200).send({
        success: 'true',
        message: 'goal post',
        goal,
      })
    }
  });

});


//post fixed amount
app.post('/post/amount', async (req, res) => {
  console.log(req.body)
  let amount = new Amount({
    selectedYear: req.body.selectedYear,
    selectedMonth: req.body.selectedMonth,
    bonus: req.body.bonus,
    commission: req.body.commission,
    pmdDeduction: req.body.pmdDeduction,
    userId: req.body.userId,
    commType: req.body.commType,
    bonusType: req.body.bonusType,
    pmdDeductionType: req.body.pmdDeductionType
  });

  amount.save(function (err) {
    if (err) {
      console.error(err);
      res.status(200).send({
        success: 'false',
        message: 'amount not post',
        amount,
      })
    } else {
      res.status(200).send({
        success: 'true',
        message: 'amount post',
        amount,
      })
    }
  });

});


//get user by user name
app.get('/get/user/:userName', (req, res) => {

  User.findOne({ userName: req.params.userName })
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);

//get all transctions
app.get('/get/all/transactions/:uid', (req, res) => {

  Transaction.find({ userId: req.params.uid })
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);

//get all transctions by year
app.get('/get/all/transactions/yearly/:uid/:year', (req, res) => {
  console.log("calleddddddd")
  Transaction.find({userId: req.params.uid, "soldDate" : {$regex : `.*${req.params.year}.*`}})
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);
//get all transctions by year
app.get('/get/all/transactions/monthly/:uid/:month/:year', (req, res) => {
  Transaction.find({userId: req.params.uid})
    .then(data => { 
      var newData = [];
      for (var i = 0;i < data.length;i++){
        if((new Date(data[i].soldDate).getFullYear())== req.params.year){
          if((new Date(data[i].soldDate).getMonth()+1)==req.params.month){
            newData.push(data[i])
          }
        }
      }
      res.json(newData);
    })
    .catch(err => res.status(404).json(err));
}

);

//get fixed amount
app.get('/get/fixedAmount/:uid/:year/:month', (req, res) => {
  console.log(req.params.uid, req.params.year, req.params.month)
  Amount.findOne({ userId: req.params.uid, selectedYear: req.params.year, selectedMonth: req.params.month })
    .then(data => {
      console.log(data)
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);

app.get('/get/fixedAmount/:uid/:year', (req, res) => {
  console.log(req.params.uid, req.params.year)
  Amount.findOne({ userId: req.params.uid, selectedYear: req.params.year })
    .then(data => {
      console.log(data)
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);

app.get('/get/user/:uid', (req, res) => {
  console.log(req.params.uid, req.params.year)
  User.findOne({ _id: req.params.uid })
    .then(data => {
      console.log(data)
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);


//get goal
app.get('/get/goal/:uid/:year', (req, res) => {
  console.log(req.params.uid, req.params.year)
  Goal.findOne({ userId: req.params.uid, selectedYear: req.params.year })
    .then(data => {
      console.log(data)
      res.json(data);
    })
    .catch(err => res.status(404).json(err));
}

);

app.post("/edit/goal/:uid/:year/:goal", async (req, res) => {
  console.log(req.params)
  Goal.updateOne({
    selectedYear: req.params.year,
    userId: req.params.uid
  }, {
    $set: {
      volume: req.params.goal,
      userId: req.params.uid,
      selectedYear:  req.params.year
    }
  },  function (err, user) {
    console.log("in function",err,user.nModified)
    if(user.nModified === 0){
      console.log("in error")
      let goal = new Goal({
        volume: req.params.goal,
        userId: req.params.uid,
        selectedYear:  req.params.year
      });
    
      goal.save(function (err) {
        if (err) {
          console.error(err);
          res.status(200).send({
            success: 'false',
            message: 'goal not post',
            goal,
          })
        } else {
          res.status(200).send({
            success: 'true',
            message: 'goal post',
            goal,
          })
        }
      });

      
    }else if(user.nModified === 1){
      res.status(200).send({
        success: 'true',
        message: 'goal updated'
      })
    }
     
  });
})

app.put("/edit/bonus/:id/:year/:month/:bonus", async (req, res) => {
  console.log(req.params)
  Amount.updateOne({
    userId: req.params.id,
    selectedYear: req.params.year,
    selectedMonth: req.params.month
  }, {
    $set: {
      bonus: req.params.bonus
    }
  }, {
    upsert: true
  }, function (err, user) {
    res.status(200).send({
      success: 'true',
      message: 'bonus updated'
    })
  });
})


// logout
app.get('/logout', function (req, res) {
  req.logout();
  // req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
