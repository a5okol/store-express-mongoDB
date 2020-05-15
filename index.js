const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const homeRoutes = require("./routes/home");
const tshirtsRoutes = require("./routes/tshirts");
const sweatshirtsRoutes = require("./routes/sweatshirts");
const hoodyRoutes = require("./routes/hoody");
const shirtsRoutes = require("./routes/shirts");
const backpacksRoutes = require("./routes/backpacks");
const cardRoutes = require("./routes/card");
const addProductRoutes = require("./routes/addProduct");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth.js");
const errorHandler = require("./middleware/error")
const profileRoutes = require("./routes/profile")
const keys = require("./keys")

const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user")
const fileMiddleware = require("./middleware/file")

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers')
});
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine("hbs", hbs.engine); // региструем в express наличие движка handlebars
app.set("view engine", "hbs"); // тут уже его используем
app.set("views", "views"); // первый параметр - название переменной, второй - название папки где будут храниться все шаблоны

app.use(express.static(path.join(__dirname, "public"))); // метод use позволяет добовлять middleware'ы
app.use('/images', express.static(path.join(__dirname, "images"))); 
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(fileMiddleware.single('avatar')) // single - говорим, что файл один
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/t-shirts", tshirtsRoutes);
app.use("/sweatshirts", sweatshirtsRoutes);
app.use("/hoody", hoodyRoutes);
app.use("/shirts", shirtsRoutes);
app.use("/backpacks", backpacksRoutes);
app.use("/card", cardRoutes);
app.use("/add-product", addProductRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Bro, Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
