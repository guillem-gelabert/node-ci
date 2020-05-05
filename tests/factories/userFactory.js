const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (googleId, displayName) => {
    return new User({}).save();
}