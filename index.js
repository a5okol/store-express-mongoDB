const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");

const mongoose = require("mongoose");

const homeRoutes = require("./routes/home");
const tshirtsRoutes = require("./routes/tshirts");
const sweatshirtsRoutes = require("./routes/sweatshirts");
const hoodyRoutes = require("./routes/hoody");
const shirtsRoutes = require("./routes/shirts");
const backpackssRoutes = require("./routes/backpacks");
const cardRoutes = require("./routes/card");
const addProductRoutes = require("./routes/addProduct");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine); // региструем в express наличие движка handlebars
app.set("view engine", "hbs"); // тут уже его используем
app.set("views", "views"); // первый параметр - название переменной, второй - название папки где будут храниться все шаблоны

app.use(express.static(path.join(__dirname, "public"))); // метод use позволяет добовлять middleware'ы
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/t-shirts", tshirtsRoutes);
app.use("/sweatshirts", sweatshirtsRoutes);
app.use("/hoody", hoodyRoutes);
app.use("/shirts", shirtsRoutes);
app.use("/backpacks", backpackssRoutes);
app.use("/card", cardRoutes);
app.use("/add-product", addProductRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `mongodb+srv://andrew:0uZrCRaZ5ORKmSXB@cluster0-tn1re.mongodb.net/test?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true });
    app.listen(PORT, () => {
      console.log(`Bro, Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
