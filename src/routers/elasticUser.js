const express = require('express');
const fs = require('fs');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/elastic-user-auth');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'http://localhost:9200/'
})
const jwt = require('jsonwebtoken');

class Person {
    email;
    password;
    tokens;
}
//this route will sign up and send token to UI.
router.post('/el/signup', async (req, res) => {
    let p = new Person();
    p.email = 'myemail'
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
                //console.log('Creating new user failed');
            } else {
                //console.log(eRes);
                const token = jwt.sign({ _id: eRes._id.toString() }, 'myNewToken');
                person.tokens = person.tokens.concat({ token });
                //console.log('<<<<<<<', person);
                try {
                    await client.update({
                        index: 'elastic_user',
                        type: 'doc',
                        id: person.email,
                        body: { doc: person },
                    }, async (err, tokenResp) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log('Token Resp Email', person.email);
                            try {
                                await client.get({
                                    index: 'elastic_user',
                                    id: person.email,
                                }, (err, finalResp) => {
                                    if (err) {
                                        console.log('Error while final fetch');
                                    } else {
                                        p= finalResp._source;
                                        console.log('^^^^^^^^^^^^^^^^^^^^finalResp', p);
                                        res.send({
                                            'message': 'Success',
                                            'resp': finalResp,
                                            'token': token
                                        });
                                    }
                                })
                            } catch (e) {
                                console.log(e.message);
                            }
                            //  console.log('Token Resp', tokenResp);
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
router.post('/el/login', async (req, res) => {
     const enPwd = await bcrypt.hash(req.body.password, 8);
    // req.body.password = enPwd;
     let person = {};
    person.email = req.body.email;
    person.password = enPwd;
    person.tokens = [];
    await client.get({
        index: 'elastic_user',
        id: req.body.email
    }, async (err, uresp) => {
        if (err) {
            console.log('user Not Found');
        } else {
             console.log(uresp);
            // console.log('XXXXXXXXXXXXXX', uresp._source.password);
            // console.log(req.body.password);
            const isMatch = await bcrypt.compare(req.body.password, uresp._source.password);
            if (!isMatch) {
                throw new Error('Unable to login password doesnt match');
            } else {
                const token = jwt.sign({ _id: uresp._id.toString() }, 'myNewToken');
                person.tokens = person.tokens.concat({ token });

                try {
                    await client.update({
                        index: 'elastic_user',
                        type: 'doc',
                        id: person.email,
                        body: { doc: person },
                    }, async (err, tokenResp) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log('Token Resp Email', person.email);
                            try {
                                await client.get({
                                    index: 'elastic_user',
                                    id: person.email,
                                }, (err, finalResp) => {
                                    if (err) {
                                   //     console.log('Error while final fetch');
                                    } else {
                                        p = finalResp._source;
                                     //   console.log('^^^^^^^^^^^^^^^^^^^^finalResp', p);
                                        res.send({
                                            'message': 'Success',
                                            'resp': finalResp,
                                            'token': token
                                        });
                                    }
                                })
                            } catch (e) {
                                console.log(e.message);
                            }
                            //  console.log('Token Resp', tokenResp);
                        }
                    })
                } catch (e) {
                    console.log('Failed while creating token');
                }
            }
        }
    })
})
router.get('/el/signup', auth, (req, res) => {
    res.send({ 'message': 'sucessfully logged in' })
})


router.post('/el/logout',  auth, async (req, res) => {
    try {
       // console.log(req.user);
        req.user.tokens = [];
        console.log(req.user);
       await client.update({
        index: 'elastic_user',
        type: 'doc',
        id: req.user.email,
        body: { doc: req.user },
       }, (err, resp)=>{
            if(err){
                console.log('Logout update call failed');
            } else {
                res.send('Sucessfully Logged out From all')
            }
       })
        
    } catch (e) {
        console.log(e);
    }
})

module.exports = router