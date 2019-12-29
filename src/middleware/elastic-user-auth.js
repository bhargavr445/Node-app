
const jwt = require('jsonwebtoken');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'http://localhost:9200/'
})

const auth = async (req, res, next) => {
    let u = {};
    try {
        //extracting token from header.
        const token = req.headers['authorization'].replace(/^Bearer\s/, '');
        console.log('Entered');
        //check if the token is valid
        const decoded = jwt.verify(token, 'myNewToken');
        console.log(decoded);
        //if token is valid find the users
        await client.get({
            index: 'elastic_user',
            id: decoded._id,
        }, (err, resp) => {
            if (err) {
                console.log('token verf failed');
            } else {
                console.log(resp);
                req.token = token;
                req.user = resp._source;
                let checkToken = req.user.tokens.find(tokenA => token);
                if (checkToken) {
                    console.log('Token Available');
                } else {
                    console.log('Token Not Available');
                    res.send('PLease Login');
                }
                next()
            }
        })
    } catch (e) {
        res.status(401).send('login Req')
    }
}

module.exports = auth