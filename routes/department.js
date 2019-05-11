var express = require("express");
var router = express.Router();
var productModule = require("../models/product");

// Multer and Cloudinary configuration
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_APY_KEY, 
  api_secret: process.env.CLOUDINARY_APY_SECRET
});

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

// INDEX - show all products
router.get("/:department", function(req, res){
    var dept = req.params.department;
    selectModel(dept);
    // if the user search for some product
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        // find it for him by put regex into the 'find' 
        Model.find({name: regex}, function(err, allProducts){
            if(err) {
                console.log(err);
            }
            else {
                 // if nothing was found
                 if(allProducts.length < 1) {
                    res.render("departments/department", {dept:dept, products: allProducts, title: title, error:"לא נמצאו תוצאות התואמות את החיפוש שלך, אנא נסה מוצר אחר."}); 
                }
                else {
                    // view all the matches results
                    res.render("departments/department", {dept:dept, products: allProducts, title: title}); 
                }
            }
        });
    }
    else {
        // Get all products from DB
        Model.find({}, function(err, allProducts){
            if(err) {
                console.log(err);
            }
            else {
                res.render("departments/department", {dept:dept, products: allProducts, title: title}); 
            }
        });
    }
});

// NEW - show form to create products
router.get("/:department/new", function(req, res){
    var dept = req.params.department;
    selectModel(dept);
    res.render("departments/new", {dept: dept});
});

// CREATE - add new product to DB
router.post("/:department", checkIfAdmin, upload.single("image"), function(req, res){
    var dept = req.params.department;
    selectModel(dept);
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the product object under image property
        req.body.product.image = result.secure_url;
        // add image's public_id to product object
        req.body.product.imageId = result.public_id;
        // create a new product and save to DB
        Model.create(req.body.product, function(err, newlyCreated) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            res.redirect(dept);
        });
    });
});

// EDIT- show form to edit product
router.get("/:department/:id/edit", checkIfAdmin, function(req, res){
    var dept = req.params.department;
    selectModel(dept);
    Model.findById(req.params.id, function(err, foundProduct){
        if(err) {
            console.log(err);
        }
        else {
            res.render("departments/edit", {dept: dept, product: foundProduct});
        }
    });
}); 

// UPDATE - update a particular product
router.put("/:department/:id",checkIfAdmin, upload.single('image'), function(req, res) {
    var dept = req.params.department;
    selectModel(dept);
    var char = "/";
    var toRedirect = char + dept;
    Model.findById(req.params.id, async function(err, product){
        if(err){
            res.redirect("back");
        } 
        else {
            if(req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(product.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    product.imageId = result.public_id;
                    product.image = result.secure_url;
                }
                catch(err) {
                    return res.redirect("back");
                }
            }
            product.name = req.body.name;
            product.price = req.body.price;
            product.save();
            res.redirect(toRedirect);
        }
    });
});

// REMOVE - delete a particular product
router.delete("/:department/:id", checkIfAdmin, function(req, res){
    var dept = req.params.department;
    selectModel(dept);
    var char = "/";
    var toRedirect = char + dept;
    Model.findById(req.params.id, async function(err, product){  
        if(err) {
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(product.imageId);
            product.remove();
            res.redirect(toRedirect);
        }
        catch(err) {
            if(err) {
                return res.redirect("back");
            }
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
function checkIfAdmin(req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.isAdmin) {
            next();
        }
        else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        }
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

// this function created in order to do the search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;