
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient//this give access to connect to database
// const objectId = mongodb.ObjectID

//this is obj destructuring from line 2,3,4
const {MongoClient, objectId} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'//localhost ID
const databaseName = 'task-manager' //collection(Schema in RDBMS) name

//this is to connect with specific server
MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client)=>{
    if(error){
       return console.log('Unable to Connect DB...');
    }
    console.log('DB Connected...');
   const db = client.db(databaseName);
//    db.collection('users').insertOne(
//        {
//            name:'Bhargav Ram', 
//            age:27
//         }, (err, result)=>{
//             if(err){
//                 return console.log('Failed to insert')
//             }
//             console.log(result.ops)
//         });

// db.collection('users').insertMany([
//     {name:'Prasanth', age:23}, 
//     {name:'Indra', age:28}
// ], (err, res)=>{
//     if(err){
//         return console.log('Failed to insert')
//     }
//     console.log('Data Inserted:', res.ops);
// })

// db.collection('tasks').insertMany([
//     {description:'Clean', completed:false}, 
//     {description:'cook', completed:false}, 
//     {description:'study', completed:false},
//     {description:'sleep', completed:true} 
// ], (err, res) => {
//     if(err){
//         return console.log('Failed to insert');
//     }
//     console.log(res.ops);
// })

// db.collection('users').findOne({name: 'Indra'}, (err, res)=> {
//     if(err){
//         return console.log('FOund Nothing');
//     }
//     console.log(res);
// })
})

const dowork = async () =>{
    return 'hello'
}

dowork().then((data)=>{
    console.log(data);
}).catch((e)=>{
    console.log(e);
})

