const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const objectId = require("mongodb").ObjectID;

// Owner model
const Owner = require("../models/Owner");
const Vehicle = require("../models/Vehicle");
const Invoice = require("../models/Invoice");
const Police = require("../models/Police");

// Validation
// const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));
// router.post('/postownersdata', (req, res) => res.json({ msg: 'post owners data works' }));

router.post("/postownersdata", (req, res) => {
  const ownersData = new Owner({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    age: req.body.age,
    mobileNumber: req.body.mobileNumber,
    IPNumber: req.body.IPNumber,
    CURP: req.body.CURP,
    drivingLicenseNumber: req.body.drivingLicenseNumber,
    insurranceCompany: req.body.insurranceCompany,
    address: req.body.address,
    street: req.body.street,
    nieghbourhood: req.body.nieghbourhood,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    postalCode: req.body.postalCode,
    picture: req.body.picture,
    createdDate: req.body.createdDate,
    status: req.body.status
  });

  new Owner(ownersData)
    .save()
    .then(users => console.log(res.json(users)))
    .catch(err => console.log(err));

});

router.post("/postvehicledata", (req, res) => {

  const vehicleData = new Vehicle({
    _id: new mongoose.Types.ObjectId(),
    ownerId: req.body.id,
    vehicleBrand: req.body.vehicleBrand,
    vehicleModel: req.body.vehicleModel,
    vehicleType: req.body.vehicleType,
    vehicleColor: req.body.vehicleColor,
    purchaseYear: req.body.purchaseYear,
    plates: req.body.plates,
    vehicleIdentificationNumber: req.body.vehicleIdentificationNumber,
    registartionDate: req.body.registartionDate,
    ownerName: req.body.ownerName,
    carStatus: req.body.carStatus,
    createdDate: req.body.createdDate,
    status: req.body.status
  });
 
  new Vehicle(vehicleData)
    .save()
    .then(users => console.log(res.json(users)))
    .catch(err => console.log(err));
});

router.post("/postpolicedata", (req, res) => {
  console.log("MMMMMMSSSSSSSSSMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
  console.log(req)
  const policeData = new Police({
    _id: new mongoose.Types.ObjectId(),
    policeId: req.body.policeId,
    ownerName: req.body.name,
    ownerId: req.body.ownerId,
    vehicleId: req.body.vehicleId,
    invoiceId: req.body.invoiceId,
    date: req.body.date,
    time: req.body.time
  });

  console.log("sasce se pehly me datattttttttttttttttttttttttttttttttttttttttttttt")
  console.log(policeData)

  new Police(policeData)
    .save()
    .then(users => console.log(res.json(users)))
    .catch(err => console.log(err));

});




// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/getownersdata", (req, res) => {
  Owner.find()
    .then(ownersData => res.json(ownersData))
    .catch(err => res.status(404).json({ nopostsfound: "No data found" }));
});

router.get("/getvehiclesdata", (req, res) => {
  Vehicle.find()
    .then(vehicleData => res.json(vehicleData))
    .catch(err => res.status(404).json({ nopostsfound: "No data found" }));
});

router.get("/getpolicedata", (req, res) => {
  Police.find()
    .then(policeData => res.json(policeData))
    .catch(err => res.status(404).json({ nopostsfound: "No data found" }));
});

//get owner
router.get("/getowner", (req, res) => {
  console.log("API HIIIIIIIIIIIIIIIIIIIT")
  Owner.findOne({ _id: req.query.id })
    .then(owner => {
      // console.log(owner)
      res.json(owner);
    })
    .catch(err => res.status(404).json(err));
});

//get vehicle
router.get("/getvehicle", (req, res) => {
  Vehicle.findOne({ _id: req.query.id })
    .then(vehicle => {
      res.json(vehicle);
    })
    .catch(err => res.status(404).json(err));
});


//post invoice
router.post("/postinvoicedata", (req, res) => {

  console.log("posting before ///////////////////")
  console.log(req.body)
  const invoiceData = new Invoice({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    emailFrom: req.body.emailFrom,
    mobileNumberFrom: req.body.mobileNumberFrom,
    owner: req.body.owner,
    firstName: req.body.firstName,
    address: req.body.address,
    emailTo: req.body.emailTo,
    mobileNumberTo: req.body.mobileNumberTo,
    challanNumber: req.body.challanNumber,
    billingDate: req.body.billingDate,
    dueDate: req.body.dueDate,
    status: req.body.status,
    description1: req.body.description1,
    description2: req.body.description2,
    description3: req.body.description3,
    description4: req.body.description4,
    description5: req.body.description5,
    description6: req.body.description6,
    description7: req.body.description7,
    quantity1: req.body.quantity1,
    quantity2: req.body.quantity2,
    quantity3: req.body.quantity3,
    quantity4: req.body.quantity4,
    quantity5: req.body.quantity5,
    quantity6: req.body.quantity6,
    quantity7: req.body.quantity7,
    amount1: req.body.amount1,
    amount2: req.body.amount2,
    amount3: req.body.amount3,
    amount4: req.body.amount4,
    amount5: req.body.amount5,
    amount6: req.body.amount6,
    amount7: req.body.amount7,
    tax1: req.body.tax1,
    tax2: req.body.tax2,
    tax3: req.body.tax3,
    tax4: req.body.tax4,
    tax5: req.body.tax5,
    tax6: req.body.tax6,
    tax7: req.body.tax7,
    discount: req.body.discount,
    totalAmount: req.body.totalAmount,
    ownerNote: req.body.ownerNote
  });

  new Invoice(invoiceData)
    .save()
    .then(users => console.log(res.json(users)))
    .catch(err => console.log(err));
});


//get invoices data
router.get("/getinvoicesdata", (req, res) => {
  Invoice.find()
    .then(invoiceData => res.json(invoiceData))
    .catch(err => res.status(404).json({ nopostsfound: "No data found" }));
});

//get invoice
router.get("/getinvoice", (req, res) => {
  Invoice.findOne({ ownersId: req.query.id })
    .then(invoice => {
      res.json(invoice);
    })
    .catch(err => res.status(404).json(err));
});

// // @route   DELETE api/posts/:id
// // @desc    Delete post
// // @access  Private
router.delete('deletevehicle', (req, res) => {
  Vehicle.findOne({ _id: req.query.id }).then(vehcile => {
    vehcile.remove().then(() => res.json({ success: true }));
  })
    .catch(err => res.status(404).json({ vehiclenotfound: 'No post found' }));
}
);

// // @route   GET api/posts/:id
// // @desc    Get post by id
// // @access  Public
// router.get('/:id', (req, res) => {
//   Post.findById(req.params.id)
//     .then(post => res.json(post))
//     .catch(err =>
//       res.status(404).json({ nopostfound: 'No post found with that ID' })
//     );
// });

// // @route   POST api/posts
// // @desc    Create post
// // @access  Private
// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validatePostInput(req.body);

//     // Check Validation
//     if (!isValid) {
//       // If any errors, send 400 with errors object
//       return res.status(400).json(errors);
//     }

//     const newPost = new Post({
//       text: req.body.text,
//       name: req.body.name,
//       avatar: req.body.avatar,
//       user: req.user.id
//     });

//     newPost.save().then(post => res.json(post));
//   }
// );

// // @route   DELETE api/posts/:id
// // @desc    Delete post
// // @access  Private
// router.delete(
//   '/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id }).then(profile => {
//       Post.findById(req.params.id)
//         .then(post => {
//           // Check for post owner
//           if (post.user.toString() !== req.user.id) {
//             return res
//               .status(401)
//               .json({ notauthorized: 'User not authorized' });
//           }

//           // Delete
//           post.remove().then(() => res.json({ success: true }));
//         })
//         .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
//     });
//   }
// );

// // @route   POST api/posts/like/:id
// // @desc    Like post
// // @access  Private
// router.post(
//   '/like/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id }).then(profile => {
//       Post.findById(req.params.id)
//         .then(post => {
//           if (
//             post.likes.filter(like => like.user.toString() === req.user.id)
//               .length > 0
//           ) {
//             return res
//               .status(400)
//               .json({ alreadyliked: 'User already liked this post' });
//           }

//           // Add user id to likes array
//           post.likes.unshift({ user: req.user.id });

//           post.save().then(post => res.json(post));
//         })
//         .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
//     });
//   }
// );

// // @route   POST api/posts/unlike/:id
// // @desc    Unlike post
// // @access  Private
// router.post(
//   '/unlike/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Profile.findOne({ user: req.user.id }).then(profile => {
//       Post.findById(req.params.id)
//         .then(post => {
//           if (
//             post.likes.filter(like => like.user.toString() === req.user.id)
//               .length === 0
//           ) {
//             return res
//               .status(400)
//               .json({ notliked: 'You have not yet liked this post' });
//           }

//           // Get remove index
//           const removeIndex = post.likes
//             .map(item => item.user.toString())
//             .indexOf(req.user.id);

//           // Splice out of array
//           post.likes.splice(removeIndex, 1);

//           // Save
//           post.save().then(post => res.json(post));
//         })
//         .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
//     });
//   }
// );

// // @route   POST api/posts/comment/:id
// // @desc    Add comment to post
// // @access  Private
// router.post(
//   '/comment/:id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validatePostInput(req.body);

//     // Check Validation
//     if (!isValid) {
//       // If any errors, send 400 with errors object
//       return res.status(400).json(errors);
//     }

//     Post.findById(req.params.id)
//       .then(post => {
//         const newComment = {
//           text: req.body.text,
//           name: req.body.name,
//           avatar: req.body.avatar,
//           user: req.user.id
//         };

//         // Add to comments array
//         post.comments.unshift(newComment);

//         // Save
//         post.save().then(post => res.json(post));
//       })
//       .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
//   }
// );

// // @route   DELETE api/posts/comment/:id/:comment_id
// // @desc    Remove comment from post
// // @access  Private
// router.delete(
//   '/comment/:id/:comment_id',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Post.findById(req.params.id)
//       .then(post => {
//         // Check to see if comment exists
//         if (
//           post.comments.filter(
//             comment => comment._id.toString() === req.params.comment_id
//           ).length === 0
//         ) {
//           return res
//             .status(404)
//             .json({ commentnotexists: 'Comment does not exist' });
//         }

//         // Get remove index
//         const removeIndex = post.comments
//           .map(item => item._id.toString())
//           .indexOf(req.params.comment_id);

//         // Splice comment out of array
//         post.comments.splice(removeIndex, 1);

//         post.save().then(post => res.json(post));
//       })
//       .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
//   }
// );

module.exports = router;
