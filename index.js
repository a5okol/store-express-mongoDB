const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine) // региструем в express наличие движка handlebars
app.set('view engine', 'hbs') // тут уже его используем
app.set('views', 'views') // первый параметр - название переменной, второй - название папки где будут храниться все шаблоны

app.use(express.static('public')) // метод use позволяет добовлять middleware'ы

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'index.html'))
  res.render('index')
});

app.get("/about", (req, res) => {
    //res.sendFile(path.join(__dirname, 'views', 'about.html'))
    res.render('about')
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Bro, Server is running on port ${PORT}`);
});
