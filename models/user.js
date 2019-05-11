var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    favoriteProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ]
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);