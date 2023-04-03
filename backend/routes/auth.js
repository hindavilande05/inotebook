const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "Hinaissmart";

//Create a User using : POST "/api/auth/createuser". No login required

router.post('/createuser', [
    
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 3 }),

], async(req, res) => {

 

    // obj = {
    //     a: 'thios',
    //     number: 34
    // }
    // res.json(obj)

    // console.log(req.body);
    // const user = User(req.body);
    // user.save()

    //If there are errors, return the Bad request and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user with this email exists already
    try{
        let user = await User.findOne({email: req.body.email});
   
        if (user){
            return res.status(400).json({error: "Sorry a user with this email already exists "})
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        //create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data={
            user:{
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        
        //res.json(user);

        res.json({authtoken});

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    // res.json({error: 'Please enter a unique value for email', message: err.message})})
})

module.exports = router