const { Router } = require("express");
const Product = require("../models/product-model");
const router = new Router();

router.get("/", async (req, res) => {
  const products = await Product.find({ typeOfclothes: "BACKPACKS" })
    .populate("userId", 'email name')
    .select("price title img typeOfclothes");
  res.render("backpacks", {
    title: "Стильные рюкзаки в интерент-магазина одежды",
    isBackpacks: true,
    products,
  });
});

// router.get("/", async (req, res) => {
//   await Product.find()
//     .then((documents) => {
//       // create context Object with 'usersDocuments' key
//       const context = {
//         products: documents.map((product) => {
//           return {
//             typeOfclothes: product.typeOfclothes,
//             availability: product.availability,
//             title: product.title,
//             price: product.price,
//             sku: product.sku,
//             quantity: product.quantity,
//             img: product.img,
//             id: product._id,
//           };
//         }),
//       };
//       // rendering usersDocuments from context Object
//       res.render("backpacks", {
//         products: context.products,
//         isBackpacks: true,
//       });
//     })
//     .catch((error) => res.status(500).send(error));
// });

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const product = await Product.findById(req.params.id);

  res.render("product-edit", {
    title: `Редактировать ${product.title}`,
    product,
  });
});

router.post("/edit", async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Product.findByIdAndUpdate(id, req.body);
  res.redirect("/");
});

router.post("/remove", async (req, res) => {
  try {
    await Product.deleteOne({ id: req.body._id });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("product", {
    layout: "empty",
    title: `Купить ${product.title} в интернет-магазине`,
    product,
  });
});

module.exports = router;
