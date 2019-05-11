var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    image: String,
    imageId: String,
    name: String,
    price: String,
});

module.exports = {
    Plastic_product: mongoose.model("Plastic_product", productSchema),
    Disposable_product: mongoose.model("Disposable_product", productSchema),
    Kitchen_product: mongoose.model("Kitchen_product", productSchema),
    Tool: mongoose.model("Tool", productSchema),
    Cleaning_product: mongoose.model("Cleaning_product", productSchema),
    Appliance: mongoose.model("Appliance", productSchema),
    Furniture: mongoose.model("Furnishing", productSchema),
    Bath_product: mongoose.model("Bath_product", productSchema),
    Textile_product: mongoose.model("Textile_product", productSchema),
    Toy: mongoose.model("Toy", productSchema),

    Product: mongoose.model("Product", productSchema)
}