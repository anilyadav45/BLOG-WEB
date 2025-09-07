const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    imageUrl : {
        type:String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
