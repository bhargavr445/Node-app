const express = require('express');
const fs = require('fs')
const app = express()
const port = process.env.PORT || 2000
require('./db/mongoose')
const UserRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const elasticRouter = require('./routers/elasticUser');
const bcrypt = require('bcryptjs')
const util = require('util');

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);

    return string + this;
};

const LoggerMiddleware = (req, res, next) => {
   // console.log(`Interceptor Worked ${req.json}`);
//     const query = 
//     {"query":{"bool":{"must":[{"bool":{"must":[{"bool":{"should":[{"has_child":{"type":"document","query":{"bool":{"should":[{"multi_match":{"query":"405866"}},{"fuzzy":{"content":"405866"}},{"wildcard":{"content":"405866"}}]}},"inner_hits":{"_source":["path_id","id"],"highlight":{"fields":{"content":{}}}}}},{"query_string":{"query":"405866"}}]}}]}}]}},"highlight":{"pre_tags":["<mark>"],"post_tags":["</mark>"],"fields":{"enter_operator":{}}},"size":20,"_source":{"includes":["*"],"excludes":[]},"from":0,"sort":[{"control_num":{"order":"asc"}}]}    //     "query":{"bool":{"must":[{"bool":{"must":[{"bool":{"should":[{"has_child":{"type":"document","query":{"bool":{"should":[{"multi_match":{"query":"title vii"}},{"fuzzy":{"content":"title vii"}},{"wildcard":{"content":"title vii"}}]}},"inner_hits":{"_source":["path_id","id"],   
//     const insert = {

//         "bool": {
//             "must": [
//                 {
//                     "has_child": {
//                         "type": "assignment",
//                         "query": {
//                             "bool": {
//                                 "must": [
//                                     {
//                                         "term": {
//                                             "expr1.keyword": "EXECSEC"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         "inner_hits": {
//                             "_source": ["action_code", "assignment_key"
//                                 , "abbreviation", "tasktype", "expr1"
//                                 , "assignee", "date_expected", "responsible", "date_assigned", "operator"]
//                         }
//                     }
//                 },
//                 {
//                     "bool": {
//                         "should": []
//                     }
//                 }
//             ]
//         }
//     };

//     let queryBuilder = {};
//     queryBuilder.query = insert;
//     queryBuilder.query.bool.must[1].bool.should = query.query;
//     queryBuilder.highlight = query.highlight;
//     queryBuilder.size = query.size;
//     queryBuilder._source = query._source;
//     queryBuilder.from = query.from;
//     queryBuilder.sort = query.sort;
// //    let s = JSON.stringify(queryBuilder);
// //    let sj = JSON.parse(s)
//   //  console.log(util.inspect( queryBuilder, { showHidden: false, depth: null }))
//   req.myQuery = queryBuilder;

    next();
}
//const path = './userDetails1.txt' 
const multer = require('multer');
const upload = multer({
    dest : 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Please upload PDF'));
        }
         //cb(new Error('File must be PDF'))
        cb(undefined, true)
        // cb(undefined, false)
    }
})
function modifyResponseBody(req, res, next) {
   // if(res){
        console.log('Resp Modify');
    //}
    
    next();
}

app.post('/api/upload', upload.single('upload'), (req, res) => {
    res.send('File upload');
}, (error, req, res, next) =>{
    res.status(400).send({error:error.message})
})
class Auth {
    login(req, res){
        console.log(req.baseUrl);
        if(req.baseUrl=='/sims'){
            console.log('sims')
        } else if(req.baseUrl=='/ofis'){
            console.log('Ofis')
        }
        res.send({
            'obj': 'own Obj',
            'token': 'myToken'
        })
    }
}

//app.use('/apis',LoggerMiddleware, )
let authClass = new Auth();
app.use('/sims',authClass.login );
app.use('/ofis', authClass.login );
app.use(express.json())
app.use(UserRouter);
app.use(taskRouter);
app.use(elasticRouter);
app.use(modifyResponseBody);



//app.use(modifyResponseBody);



// app.get('', (req, res) => {
//     res.send('Empty Route');
// })

// app.get('/help', (req, res) => {
//     res.send('Help Route');
// })



// const myFun = async () =>{
//     const pswd ="test@12345"
//     const hashPswd = await bcrypt.hash(pswd,8);
//     console.log(pswd);
//     console.log(hashPswd);

//     const isMatch = await bcrypt.compare(pswd, hashPswd);
//     console.log(isMatch)
// }

// myFun()



// app.get('/products', (req, res) => {
//     var date = new Date();
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     let year = date.getFullYear();
//     let fileName = year.toString() + month.toString() + day.toString();
//     const path = './' + fileName;   
//         fs.appendFile(path, "Login Time:" + year + '/' + month + '/' + day + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
//             "-Logged in as:" + "" + req.query.search +"\r\n",
//             (err) => {
//             });
//     res.send({
//         products: []
//     })
// })



app.listen(2000, () => {
    console.log('server Started on 2000');
});
