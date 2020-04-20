const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

class Product {
  constructor(typeOfclothes, availability, title, price, sku, quantity, img) {
    this.typeOfclothes = typeOfclothes;
    this.availability = availability;
    this.title = title;
    this.price = price;
    this.sku = sku;
    this.quantity = quantity;
    this.img = img;
    this.id = uuidv4();
  }

  toJSON() {
    return {
      typeOfclothes: this.typeOfclothes,
      availability: this.availability,
      title: this.title,
      price: this.price,
      sku: this.sku,
      quantity: this.quantity,
      img: this.img,
      id: this.id,
    };
  }

  async save() {
    const products = await Product.getAll();
    products.push(this.toJSON());

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "products.json"),
        JSON.stringify(products),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "products.json"),
        "utf-8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      );
    });
  }
  // static getBackpacks() {
  //   return new Promise((resolve, reject) => {
  //     fs.readFile(
  //       path.join(__dirname, "..", "data", "products.json"),
  //       "utf-8",
  //       (err, content) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           let backpackparse = content.split('').filter(e => e.typeOfclothing === "BACKPACKS" ? backpack : null )
  //           // let backpackparse = Object.values(content).filter(backpack => backpack.typeOfclothing === "BACKPACKS" ? null : backpack )

  //           let backpackparse2 = [...backpackparse].filter(backpack => backpack.typeOfclothing === "BACKPACKS" ? null : backpack).join``
  //           resolve(
  //             // JSON.parse(backpackparse)
  //           );
  //         }
  //       }
  //     );
  //   });
  // }

  static async getById(id) {
    const products = await Product.getAll();
    return products.find((c) => c.id === id);
  }
}

module.exports = Product;
