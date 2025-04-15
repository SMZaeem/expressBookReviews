const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let users = require("./usersdb.js");
const regd_users = express.Router();

// let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const userExist = Object.values(users).filter((user) => user.username === username);
  if(userExist.length == 0){
    res.status(404).json({message: "User doesn't exist. Kindly register!!"})
    return false;
  }
  else{
    if(userExist[0].password === password){
      return true;
    } else {
      res.status(208).json({message: "Incorrect password!!"});
      return false;
    }
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  try {
    if(!username || !password)
      return res.status(404).json({ message: "Error logging in" });
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
  
      req.session.authorization = {
        accessToken, username
      };
      return res.status(200).json({message: "User logged in successfully!!"});
    } else {
      return res.status(404).json({message: "Try again!!"});
    }
  } catch (error) {
    return res.status(400).json({message: "Sme unknown error occured!!"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization?.username;
  try {
    if(user){
      const matchedBookId = Object.keys(books).find((key) => books[key].isbn === req.params.isbn);
      if(matchedBookId){
        const matchedBook = books[matchedBookId];

        if (!Array.isArray(matchedBook.reviews)) {
          matchedBook.reviews = [];
        }

        let userExist = false;
        matchedBook.reviews.forEach((item) => {
          if(item.username === user){
            userExist = true;
            item.review = req.body.review;
          }
        })
        if(!userExist){
          matchedBook.reviews.push({"username": user, "review": req.body.review})
        }
        return res.status(200).json({
          message: "Review added/updated successfully.",
          reviews: matchedBook.reviews
        });
      }
      else
        return res.status(200).json({message: "No matching books found!!"});
    } else {
      return res.status(403).json({message:"User doesn't exist to add reviews!!"});
    }
  } catch (error) {
    return res.status(403).json({message:"Unknown error occured!!"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization?.username;

  try {
    if(user){
      matchedBookId = Object.keys(books).find((key) => books[key].isbn === req.params.isbn);
      if(matchedBookId){
        matchedBook = books[matchedBookId];
      }
      if(!Array.isArray(matchedBook.reviews)){
        return res.status(303).json({message: "Can't delete review as no review exist!"});
      }
      matchedBook.reviews = matchedBook.reviews.filter((item) => item.username != user);
      return res.status(200).json({
        message: "Review deleted successfully.",
        reviews: matchedBook.reviews
      });
    } else {
      return res.status(403).json({message:"User doesn't exist to add reviews!!"});
    }
  } catch (error) {    return res.status(403).json({message:"Unknown error occured!!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
