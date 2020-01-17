const express = require('express');
const elasticAuth = require('../middleware/elastic-user-auth');
const router = new express.Router();
const elasticSearch = require('elasticSearch');
const client = new elasticSearch.Client({
    host: 'http://localhost:9200/'
});
router.get('/api/getAllProducts', elasticAuth, async (req, res) => {
    await client.search({
        index: 'products',
        body: {
            query: {
                match_all: {}
            }
        },
    }, (err, resp) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({ response: resp.hits.hits });
        }
    });

});

module.exports = router;