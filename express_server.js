const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
function generateRandomString() {
  return Math.random().toString(20).substr(2, 6)
}


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log(req.cookies["user_id"])
  const user = users[req.cookies["user_id"]]
  console.log(user)
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], email: user.email };
  
  
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: req.cookies["user_id"]}
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL, user_id: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL] 
  res.redirect(longURL);
});


app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"], email: null };

  // const templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };
  res.render("register", templateVars);
});


app.post("/urls/", (req, res) => {
   
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL
  // console.log(urlDatabase)
  res.redirect('/urls/' + shortURL)
});

app.post("/urls/:shortURL/delete", (req, res) => {
const shortURL = req.params.shortURL
delete urlDatabase[shortURL]
res.redirect('/urls')
});

app.post("/urls/:id", (req, res) => {
  console.log("postlongURl", urlDatabase)
  const longURL = req.body.longURL
  const shortURL = req.params.id
  console.log(longURL)
  console.log(shortURL)
  urlDatabase[shortURL] = longURL
  res.redirect('/urls')
  return
  });

app.post("/login", (req, res) => {
  const user_id = req.body.user_id
  res.cookie("user_id", user_id)
  res.redirect('/urls')
  });

  app.post("/logout", (req, res) => {
    res.clearCookie("user_id")
    res.redirect('/register')
    });


app.post("/register", (req, res) => { 
const id = generateRandomString()
const email = req.body.email
const password = req.body.password
const user = { id, email, password};
users[id] = user
console.log(users[id])
res.cookie("user_id", id)
res.redirect('/urls')
});    