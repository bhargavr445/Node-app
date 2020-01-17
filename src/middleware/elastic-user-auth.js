
const jwt = require('jsonwebtoken');
const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    host: 'http://localhost:9200/'
});

const elasticAuth = async (req, res, next) => {
    try {
        //extracting token from header.
        //console.log('Entered');
        const token = req.headers['authorization'].replace('Bearer', '');
        //check if the token is valid
        const decoded = jwt.verify(token, 'myNewToken');
        //if token is valid this will find the users
        await client.get({
            index: 'elastic_user',
            id: decoded._id,
        }, (err, resp) => {
            if (err) {
                console.log('token verification failed');
            } else {
                req.token = token;
                req.user = resp._source;
                let checkToken = req.user.tokens.find((tokenA) => {
                   return tokenA.token === token;
                });
                console.log(checkToken);
                if (checkToken) {
                    console.log('Token Available');
                    next()
                } else {
                    console.log('Token Not Available');
                   res.status(401).send('No Token Available');
                }
            }
        })
    } catch (e) {
        res.status(401).send('login Req');
    }
};

module.exports = elasticAuth;