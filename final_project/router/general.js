const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./usersdb.js");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  try {
    if(username && password){
      const userExist = Object.values(users).filter((user) => user.username === username);
      if(userExist.length > 0){
        return res.status(403).json({message:"User already exists!! Please login."});
      }
      else{
        const index = Object.keys(users).length;
        users.index = {"username": username, "password": password};
        return res.status(200).json({message: "User registered successfully!!", username: username});
      }
    } else {
      return res.status(300).json({message: "Both username and password are required!!"});
    }
  } catch (error) {
    return res.status(400).json({message: "An error occured while registring!!"});
  }



});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(403).json({message:"Unable to fetch books!!"});
  }
});

// const fetchBooks =  async () => {
//     const response = await axios.get(`http://localhost:5000/books`);
//     if(response)
//       return response.data;
//     else
//       return null;
// }

// public_users.get('/', async function(req, res) {
//   try {
//     const fetchedBooks = await fetchBooks();
//     return res.status(200).json(fetchedBooks);
//   } catch (error) {
//     return res.status(404).json({ message: error });
//   }
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  try {
    const matchedBook = Object.values(books).filter((book) => book.isbn == req.params.isbn);
    if(matchedBook.length > 0)
      return res.status(200).json(matchedBook);
    else
      return res.status(200).json({message: "No matching books found!!"});
  } catch (error) {
    return res.status(403).json({message:"Unable to fetch the book!!"});
  }
 });

//  const getBookByISBN = (isbn) => {
//   return new Promise((resolve, reject) => {
//     const matchedBook = Object.values(books).filter((book) => book.isbn === isbn);
//     if (matchedBook.length > 0) {
//       resolve(matchedBook);
//     } else {
//       reject("No matching books found!!");
//     }
//   });
// };

// public_users.get('/isbn/:isbn', async (req, res) => {
//   try {
//     const isbn = req.params.isbn;
//     const book = await getBookByISBN(isbn);
//     return res.status(200).json(book);
//   } catch (error) {
//     return res.status(404).json({ message: error });
//   }
// });



  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  try {
    const matchedBooks = Object.values(books).filter((book) => book.author === req.params.author);
    if(matchedBooks.length > 0)
      return res.status(200).json(matchedBooks);
    else
      return res.status(200).json({message: "No matching books found!!"});
  } catch (error) {
    return res.status(403).json({message:"Unable to fetch the book!!"});
  }
});

// const getBooksByAuthor = (author) => {
//   return new Promise((resolve, reject) => {
//     const matchedBooks = Object.values(books).filter((book) => book.author === author);
//     if (matchedBooks.length > 0) {
//       resolve(matchedBooks);
//     } else {
//       reject("No matching books found!!");
//     }
//   });
// };

// public_users.get('/author/:author', async (req, res) => {
//   try {
//     const author = req.params.author;
//     const booksByAuthor = await getBooksByAuthor(author);
//     return res.status(200).json(booksByAuthor);
//   } catch (error) {
//     return res.status(404).json({ message: error });
//   }
// });





// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const matchedBooks = Object.values(books).filter((book) => book.title === req.params.title);
    if(matchedBooks.length > 0)
      return res.status(200).json(matchedBooks);
    else
      return res.status(200).json({message: "No matching books found!!"});
  } catch (error) {
    return res.status(403).json({message:"Unable to fetch the book!!"});
  }
});

// const getBooksByTitle = (title) => {
//   return new Promise((resolve, reject) => {
//     const matchedBooks = Object.values(books).filter((book) => book.title === title);
//     if (matchedBooks.length > 0) {
//       resolve(matchedBooks);
//     } else {
//       reject("No matching books found!!");
//     }
//   });
// };

// public_users.get('/title/:title', async (req, res) => {
//   try {
//     const title = req.params.title;
//     const booksByTitle = await getBooksByTitle(title);
//     return res.status(200).json(booksByTitle);
//   } catch (error) {
//     return res.status(404).json({ message: error });
//   }
// });




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const matchedBook = Object.values(books).filter((book) => book.isbn === req.params.isbn);
    const matchedBookReviewsObject = matchedBook[0].reviews; 
    // let matchedBookReviews = []
    // Object.values(matchedBookReviewsObject).forEach((item) => {
    //   matchedBookReviews.push(item.review);
    // })
    if(matchedBookReviewsObject.length > 0)
      return res.status(200).json(matchedBookReviewsObject);
    else
      return res.status(200).json({message: "No reviews for matching book found!!"});
  } catch (error) {
    return res.status(403).json({message:"Unable to fetch the book!!"});
  }
});

module.exports.general = public_users;
