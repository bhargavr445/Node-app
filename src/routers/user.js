const express = require('express');
const User = require('../models/user');
const fs = require('fs');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const elasticSearch = require('elasticsearch');
const client = new elasticSearch.Client({
    host: 'http://localhost:9200/'
})

router.post('/api/create', async (req, res) => {
    try {
        const {response} = client.create({
            index: 'agencies',
            id: req.body.id,
            body: {
                userName: req.body.email,
                agencies: ['DOL', 'OSHA', 'OCIO'],
            }
        }, (err, resp) => {
            if (err) {
                console.log('>>>>>>>>>>>>>>>>>>>///', err);
            } else {
                console.log('>>>>>>>>>>>>>', response);
                res.status(201).send({resp});
            }
        });
    } catch (e) {
        console.log('>>>>>>>>>>' + 'Creation failed');
    }
});

router.get('/api/create/:id', async (req, res) => {
    const id = req.params.id;
    await client.get({
        index: 'agencies',
        id: id,
    }, (err, resp) => {
        if (err) {
            console.log('Get By Id Error');
        } else {
            console.log('Get By Id Resp', resp._source.agencies);
            let uniqueAgencies = Array.from(new Set(resp._source.agencies));
            res.send({
                'resp': uniqueAgencies
            })
        }
    })
});

router.post('/api/elastic', async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    try {
        client.index({
            index: 'user',
            type: 'userType',
            body: {
                query: {
                    match: {"email": "bhargav442@gmail.com"}
                },
            }
        }, (err, resp, status) => {
            if (err) {
                console.log('Elastic post not working');
            } else {
                const {body} = resp;
                console.log('>>>>>>>>>>>>>>', resp);
                resp.hits.hits.forEach(function (hit) {
                    console.log(hit);
                })
            }
        })
    } catch (e) {
        console.log(e);
    }
});

router.get('/api/elastic', (req, res) => {

    try {
        var {myResp} = client.index({
            index: 'user',
            type: 'userType',
            body: {
                query: {
                    match: {"email": "bhargav442@gmail.com"}
                },
            }
        }, (err, resp, status) => {
            if (err) {
                console.log('Elastic get not working');
            } else {
                //const {body} = resp;
                console.log('>>>>>>>>>>>>>>', myResp);
                //    resp.hits.hits.forEach(function(hit){
                //     console.log(hit);
                //   })
                res.send('Get Worked E');
            }
        })
    } catch (e) {
        console.log(e);
    }


});

//create new user end point and generates token.
router.post('/user', async (req, res) => {
    console.log('Main');
    const enPwd = await bcrypt.hash(req.body.password, 8);
    req.body.password = enPwd;
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({token, user});
    } catch (e) {
        res.status(400).send(e);
    }
});

//log in end point and generates token.
router.post('/api/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({token, user});
    } catch (e) {
        res.status(400).send()
    }
});

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        console.log(req.user.tokens);
        await req.user.save();
        res.status(200).send('Logged out');
    } catch (e) {
        res.status(500).send('Logout Failed');
    }
})

router.post('/user/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Logged out From all')
    } catch (e) {
        console.log(e);
    }
});


router.get('/api/users', auth, async (req, res) => {
    try {
        console.log(req.myQuery);
        const user = await User.find({});
        res.status(200).send(req.myQuery);
    } catch (e) {
        res.status(400).send(e)
    }
});


module.exports = router;