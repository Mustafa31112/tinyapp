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

function generateRandomString() {
  return Math.random().toString(20).substr(2, 6)
}
console.log(generateRandomString())

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
  console.log(req.cookies["username"])
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL] 
  res.redirect(longURL);
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
  const username = req.body.username 
  res.cookie("username", username)
  res.redirect('/urls')
  });

  app.post("/logout", (req, res) => {
    res.clearCookie("username")
    res.redirect('/urls')
    });