const User = require('../models/user');
const Pet = require('../models/pet');

exports.getHumans = (req, res, next) => {
    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "products"]
    }
    User.find({ lookingForPets: true })
        .then(data => { res.render('search/humans', { 'data': data, page: page }); });
};

exports.postHumans = (req, res, next) => {
    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "products"]
    }
    
    let searchParams = { lookingForPets: true }
    if (req.body.pet_breed !== "") {
        searchParams.pet_breed = req.body.pet_breed;
    }
    if (req.body.pet_size !== "") {
        searchParams.pet_size = req.body.pet_size;
    }
    if (req.body.pet_activity_level !== "") {
        searchParams.pet_activity_level = req.body.pet_activity_level;
    }
    if (req.body.pet_gender !== "") {
        searchParams.pet_gender = req.body.pet_gender;
    }
    if (req.body.pet_fenced_yard !== "") {
        searchParams.pet_fenced_yard = req.body.pet_fenced_yard == "Yes" ? true : false;
    }
    if (req.body.pet_gender !== "") {
        searchParams.pet_gender = req.body.pet_gender;
    }
    if (req.body.pet_age !== "") {
        searchParams.pet_age = req.body.pet_age;
    }
    console.log(searchParams);
    User.find(searchParams)
        .then(data => {
            res.render('search/humans',
                {
                    'data': data,
                    searchParams: searchParams,
                    page: page
                });
        });
};

exports.getPets = (req, res, next) => {
    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "products"]
    }
    Pet.find()
        .then(data => { res.render('search/pets', { 'data': data, page: page }); });
};

exports.postPets = (req, res, next) => {
    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "products"]
    }
    Pet.find()
        .then(data => { res.render('search/pets', { 'data': data, page: page }); });
};


