
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
try{
        //extracting token from header.
        const token = req.headers['authorization'].replace(/^Bearer\s/, '');
         console.log('Entered');
        //check if the token is valid
        const decoded = jwt.verify(token, 'myNewToken');
        //if token is valid find the users
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if (!user) {
            throw new Error()
        }
        //to req add token and user info
        req.token = token;
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send('login Req')
    }
}

module.exports = auth