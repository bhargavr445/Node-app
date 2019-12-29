const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    tokens: [{ token: { type: String } }]
})

//this is to ignore tokens array and password fields from the user obj
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

//if user is authenticated token is generated here
userSchema.methods.generateAuthToken = async function (user) {
   // const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'myNewToken');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

//this is to checkk if the user is authenticated or not
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('No user Found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}
const User = mongoose.model('User', userSchema)

module.exports = User;
