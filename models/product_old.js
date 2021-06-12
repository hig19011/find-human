const Book = require('../models/book');
const User = require('../models/user');

const fs=require('fs');
const path = require('path');
const { mongooseOptions } = require('../config');
const base=path.dirname(process.mainModule.filename);
const dataFile=path.join(base,'data','books.json');
const dataFileUsers=path.join(base,'data','humans.json');

async function readJSONFile(file){
    try{
        const contents = await fs.promises.readFile(file);
        return JSON.parse(contents);
    } catch (err){
        console.error(err);
        return [];
    }
}

exports.loadLibrary = function(userId=null){
    readJSONFile(dataFile).then((lib)=>{        
        lib.forEach(b => {
            let newBook=new Book(b);
            newBook.userId=userId;
            newBook.save();
        });
    });

    readJSONFile(dataFileUsers).then((lib)=>{
        lib.forEach(b => {
            let newBook=new User(b);
            newBook.userId=userId;
            newBook.save();
        });
    });
}