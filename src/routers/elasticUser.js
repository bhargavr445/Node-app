const express = require('express');
//const fs = require('fs');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const elasticSearch = require('elasticSearch');
const elasticAuth = require('../middleware/elastic-user-auth');
const client = new elasticSearch.Client({
    host: 'http://localhost:9200/'
});
const jwt = require('jsonwebtoken');
const Person = require('../models/person');


//this route will sign up and send token to UI.
router.post('/api/el/signup', async (req, res) => {
    let p = new Person();
    p.email = 'myemail';
    const enPwd = await bcrypt.hash(req.body.password, 8);
    req.body.password = enPwd;
    let person = {};
    person.email = req.body.email;
    person.password = req.body.password;
    person.tokens = [];
    try {
        client.create({
            index: 'elastic_user',
            type: 'doc',
            id: req.body.email,
            body: person
        }, async (err, eRes) => {
            if (err) {
                console.log(err);
            } else {
                const token = jwt.sign({_id: eRes._id.toString()}, 'myNewToken');
                person.tokens = person.tokens.concat({token});
                try {
                    await client.update({
                        index: 'elastic_user',
                        type: 'doc',
                        id: person.email,
                        body: {doc: person},
                    }, async (err, tokenResp) => {
                        if (err) {
                            console.log(err);
                        } else {
                            try {
                                await client.get({
                                    index: 'elastic_user',
                                    id: person.email,
                                }, (err, finalResp) => {
                                    if (err) {
                                        console.log('Error while final fetch');
                                    } else {
                                        p = finalResp._source;
                                        res.json({
                                            'message': 'Success',
                                            'resp': finalResp,
                                            'token': token
                                        });
                                    }
                                })
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    })
                } catch (e) {
                    console.log('Failed while creating token');
                }
            }
        });
    } catch (e) {
        console.log('Failed');
    }
});
router.post('/api/el/login', async (req, res) => {
    console.log('Hit Server');
    const enPwd = await bcrypt.hash(req.body.password, 8);
    let person = {};
    person.email = req.body.email;
    person.password = enPwd;
    person.tokens = [];
    console.log(req.body);
    await client.get({
        index: 'elastic_user',
        type: 'doc',
        id: req.body.email
    }, async (err, uresp) => {
        if (err) {
            console.log('#######################', err.message);
        } else {
            console.log(uresp);
            console.log('Res Password', uresp._source.password);
            const isMatch = await bcrypt.compare(req.body.password, uresp._source.password);
            if (!isMatch) {
                throw new Error('Unable to login password doesnt match');
            } else {
                const token = jwt.sign({_id: uresp._id.toString()}, 'myNewToken');
                person.tokens = person.tokens.concat({token});
                try {
                    await client.update({
                        index: 'elastic_user',
                        type: 'doc',
                        id: person.email,
                        body: {doc: person},
                    }, async (err, tokenResp) => {
                        if (err) {
                            console.log(err);
                        } else {
                            try {
                                await client.get({
                                    index: 'elastic_user',
                                    id: person.email,
                                }, (err, finalResp) => {
                                    if (err) {
                                    } else {
                                        p = finalResp._source;
                                        res.json({
                                            'message': 'Success',
                                            'resp': finalResp,
                                            'token': token
                                        });
                                    }
                                })
                            } catch (e) {
                                console.log(e.message);
                            }
                        }
                    })
                } catch (e) {
                    console.log('Failed while creating token');
                }
            }
        }
    });
});

router.get('/api/el/signup', (req, res) => {
    console.log('I am working');
    res.json({msg: 'Sucessfully logged in'});
});


router.post('/api/el/logout', elasticAuth, async (req, res) => {
    try {
        req.user.tokens = [];
        console.log(req.user);
        await client.update({
            index: 'elastic_user',
            type: 'doc',
            id: req.user.email,
            body: {doc: req.user},
        }, (err, resp) => {
            if (err) {
                console.log('Logout update call failed');
            } else {
                console.log(resp);
                res.status(200).send({msg: 'Successfully Logged out'});

            }
        })

    } catch (e) {
        console.log(e);
    }
});


router.post('/api/logout', (req, res) => {
    console.log(req.user);
    res.status(200).send({msg: 'Logout working'});
});


module.exports = router;
