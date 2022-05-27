const express = require('express');
const router = express.Router();
const {User} = require("../../models")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

router.post("/login", (req, res) => {
    User.findOne({where:{email:req.body.email}}).then(dbUser=>{
        if(!dbUser){
          console.log("no user")
            return res.status(403).send("invalid credentials")
        } 
        if (bcrypt.compareSync(req.body.password,dbUser.password)) {
          //creating the token 
            const token = jwt.sign(
              //data to include.  NOTE: jwts are encoded, not encrypted.  Meaning, the can easily be decoded.  Dont put sensitive data in here
              {
                email: dbUser.email,
                id: dbUser.id,
                tacos:[
                  {
                      shell:"soft",
                      filling:"fish"
                  },
                  {
                      shell:"hard",
                      filling:"beef"
                  }
              ]
              },
              //secret string to verify signature.  should be an env variable for saftey
              process.env.JWT_SECRET,
              //options object, expiresIn says how long the token is valid for.  Takes a string
              {
                expiresIn: "2h"
              }
            );
            res.json({ 
                token: token, 
                user: dbUser
            });
          } else {
            return res.status(403).send("invalid credentials");
          }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({msg:"an error occured",err})
    })
});

//protected route, request must include an authorization header with a bearer token
router.get("/secretclub", (req, res) => {
  //logging header data
  console.log(req.headers);
  //stripping token info from header data
  const token = req.headers?.authorization?.split(" ").pop();
  //login token
  console.log(token);
  //verifying token is valid, was signed with same secret
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    //if err, invalid token, user not authorized
    if (err) {
      console.log(err);
      res.status(403).json({ msg: "invalid credentials", err });
    } else {
      //if no err, user valid, can continue 
      User.findByPk(data.id).then(userData=>{
          console.log(userData.get({plain:true}));
          res.json({msg:`Welcome to the club, ${userData.email}!`})
      })
    }
  });
});

module.exports = router;