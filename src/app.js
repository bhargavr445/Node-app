const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 2000;
require('./db/mongoose');
const session = require('express-session');
const UserRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const elasticRouter = require('./routers/elasticUser');
const productsRoute = require('./routers/products');
const bcrypt = require('bcryptjs');
const util = require('util');
const bodyParser = require('body-parser');
const cors = require('cors');
var saml2 = require('saml2-js');
app.use(bodyParser.urlencoded({
    extended: true
}));
var sp_options = {
    entity_id: "https://sp.example.com/metadata.xml",
 //   private_key: fs.readFileSync("key-file.pem").toString(),
 //   certificate: fs.readFileSync("cert-file.crt").toString(),
    assert_endpoint: "https://sp.example.com/assert"
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
    sso_login_url: "https://idp.example.com/login",
    sso_logout_url: "https://idp.example.com/logout",
   // certificates: [fs.readFileSync("cert-file1.crt").toString(), fs.readFileSync("cert-file2.crt").toString()]
};
var idp = new saml2.IdentityProvider(idp_options);

// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
    res.type('application/xml');
    res.send(sp.create_metadata());
});


// Starting point for login
app.get("/login", function(req, res) {
    console.log(idp);
    console.log(sp);
    sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
        if (err != null) {
            return res.send(500);
        }
        res.redirect(login_url);
    });
});

// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
    var options = {request_body: req.body};
    sp.post_assert(idp, options, function(err, saml_response) {
        if (err != null)
            return res.send(500);

        // Save name_id and session_index for logout
        // Note:  In practice these should be saved in the user session, not globally.
        name_id = saml_response.user.name_id;
        session_index = saml_response.user.session_index;

        res.send("Hello #{saml_response.user.name_id}!");
    });
});

// Starting point for logout
app.get("/logout", function(req, res) {
    var options = {
        name_id: name_id,
        session_index: session_index
    };

    sp.create_logout_request_url(idp, options, function(err, logout_url) {
        if (err != null)
            return res.send(500);
        res.redirect(logout_url);
    });
});

var sess;


const allowCrossDomain = (req, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
response.setHeader("Access-Control-Allow-Headers", 
                    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                    next();
};
app.use(cors());
app.use(express.json());
const createSession = () => {
    console.log('This is session creation');
};
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.use(cors());
app.use(UserRouter);
app.use(taskRouter);
app.use(elasticRouter);
app.use(productsRoute);


app.listen(2000, () => {
    console.log('server Started on 2000');
});