var express = require("express");
var router = express.Router();
var productModule = require("../models/product");
var User = require("../models/user");

var Plastic_product = productModule.Plastic_product,
    Disposable_product = productModule.Disposable_product,
    Kitchen_product = productModule.Kitchen_product,
    Tool = productModule.Tool,
    Cleaning_product = productModule.Cleaning_product,
    Appliance = productModule.Appliance,
    Furniture = productModule.Furniture,
    Bath_product = productModule.Bath_product,
    Textile_product = productModule.Textile_product,
    Toy = productModule.Toy;

var Product = productModule.Product;

// show user's cart
router.get("/cart", isLoggedIn, function(req, res){
    User.find({}).populate("favoriteProducts").exec(function(err, users) {
        if(err){
            console.log(err);
        }
        else {
            res.render("cart", {users: users});
        }
    });
});

// add product to the user's cart
router.post("/:department/:userID/:productID",isLoggedIn, function(req, res) {
    var dept = req.params.department;
    selectModel(dept);
    // lookup user using ID
    User.findById(req.params.userID, function(err, user){
        if(err) {
            console.log(err);
            res.redirect("/");
        }
        else {
            // find product from correct department using ID
            Model.findById(req.params.productID, function(err, foundProduct){
                if(err) {
                    console.log(err);
                    res.redirect("/");
                }
                else {
                    // create new product
                    Product.create({
                        image: foundProduct.image,
                        name: foundProduct.name,
                        price: foundProduct.price
                    }, function(err, product) {
                        if(err) {
                            console.log(err);
                            res.redirect("/"); 
                        }
                        else {
                            // connect new product to the user
                            user.favoriteProducts.push(product);
                            user.save();

                            // redirect cart page
                            res.redirect("/cart");
                        }
                    });
                }
            });
        }
    });
});

// delete product from the user's cart
router.delete("/:productID", isLoggedIn, function(req, res){
    Product.findByIdAndRemove(req.params.productID, function(err, removedProduct) {
        if(err) {
            console.log(err);
        }
        else {
            // redirect cart page
            res.redirect("/cart");
        }
    })
});


var Model, title;
function selectModel(dept) {
    switch(dept) {
        case "plastic-products":
            Model = Plastic_product;
            title = "כלי פלסטיק";
            break;
        case "disposable-products":
            Model = Disposable_product;
            title = "חד פעמי";
            break;
        case "kitchen-products":
            Model = Kitchen_product;
            title = "מטבח ואפייה";
            break;
        case "tools":
            Model = Tool;
            title = "כלי עבודה";
            break;
        case "cleaning-products":
            Model = Cleaning_product;
            title = "מוצרי ניקיון";
            break;
        case "appliances":
            Model = Appliance;
            title = "מוצרי חשמל";
            break;
        case "furnishings":
            Model = Furniture;
            title = "ריהוט ונוי";
            break;
        case "bath-products":
            Model = Bath_product;
            title = "מוצרי אמבט";
            break;
        case "textile-products":
            Model = Textile_product;
            title = "טקסטיל לבית";
            break;
        case "toys":
            Model = Toy;
            title = "צעצועים";
            break;
    }
}

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "עליך להיות מחובר");
    res.redirect("/login");
}

module.exports = router;