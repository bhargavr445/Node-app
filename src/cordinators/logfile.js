const express = require('express');
 


 exports.file = (userName) => {

    var date = new Date();
    let day = ('0' + date.getDate()).slice(-2);
    //let day = date.getDate >10? date.getDate().toString(): ('0'+date.getDate())
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear().toString();
    let fileName = year + month + day;
    const path = './' + fileName;
    //write this in call back function

    fs.appendFile(path, "Login Time:" + year + '/' + month + '/' + day + "-" + ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2) +
        "-Logged in as:" + "" + userName + "\r\n",
        (err) => {
            // "throw Exception";
        });
} 

//export { file };


let myList = student.filter(
    (stu) => {
        if(stu.age<=25){ 
            return stu;
        }
    }
);
