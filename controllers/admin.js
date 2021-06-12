const Pet = require('../models/pet');

const {
    validationBulder
} = require('../util/util');

exports.getAddPet = (req, res, next) => {
    const page = {
        title: "Pet Registration",
        path: "/admin/editRegistration",
        style: ["pretty", "form"],
        message: req.flash('message')
    }
    res.render('admin/editRegistration', {
        page,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.getPets = (req, res, next) => {
    Pet.find({
            owerId: req.user._id
        })
        .then(pets => {
            console.log(pets);
            res.render('admin/pets', {
                pets: pets,
                pageTitle: 'pets',
                path: '/admin/pets'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAddPet = (req, res, next) => {
    const imageUrl = req.body.imageUrl;
    const name = req.body.name;
    const species = req.body.species;
    const breed = req.body.breed;
    const age = req.body.age;
    const gender = req.body.gender;
    const activityLevel = req.body.activityLevel;
    const description = req.body.description;
    const specialNeeds = req.body.specialNeeds;
    const adoptionFee = req.body.adoptionFee;
    const errors = validationBulder(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-pet', {
            pageTitle: 'Add Pet',
            path: '/admin/add-pet',
            editing: false,
            hasError: true,
            pet: {
                imageUrl: imageUrl,
                name: name,
                species: species,
                breed: breed,
                age: age,
                gender: gender,
                activityLevel: activityLevel,
                description: description,
                specialNeeds: specialNeeds,
                adoptionFee: adoptionFee
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const pet = new Pet({
        imageUrl: imageUrl,
        name: name,
        species: species,
        breed: breed,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        description: description,
        specialNeeds: specialNeeds,
        adoptionFee: adoptionFee,
        owerId: req.user
    });
    pet
        .save()
        .then(result => {
            // console.log(result);
            console.log('Created Pet');
            res.redirect('/admin/pets');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditPet = (req, res, next) => {
    const page = {
        title: "Edit Pet",
        path: "/admin/editRegistration",
        style: ["pretty", "form"],
        message: req.flash('message')
    }

    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const petId = req.params.petId;
    Pet.findById(petId)
        .then(pet => {
            if (!pet) {
                return res.redirect('/');
            }
            console.log('page', page);
            res.render('admin/edit-pet', {
                page,
                // pageTitle: 'Edit Pet',
                // path: '/admin/edit-pet',
                // editing: editMode,
                pet: pet,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditPet = (req, res, next) => {
    const petId = req.body.petId;
    const updatedImageUrl = req.body.imageUrl;
    const updatedname = req.body.name;
    const updatedSpecies = req.body.species;
    const updatedBreed = req.body.breed;
    const updatedAge = req.body.age;
    const updatedGender = req.body.gender;
    const updatedActivityLevel = req.body.activityLevel;
    const updatedDesc = req.body.description;
    const updatedSpecialNeeds = req.body.specialNeeds;
    const updatedAdoptionFee = req.body.adoptionFee;

    const errors = validationBulder(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-pet', {
            pageTitle: 'Edit Pet',
            path: '/admin/edit-pet',
            editing: true,
            hasError: true,
            pet: {
                imageUrl: updatedImageUrl,
                name: updatedname,
                species: updatedSpecies,
                breed: updatedBreed,
                age: updatedAge,
                gender: updatedGender,
                activityLevel: updatedActivityLevel,
                description: updatedDesc,
                specialNeeds: updatedSpecialNeeds,
                adoptionFee: updatedAdoptionFee,
                _id: petId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Pet.findById(petId)
        .then(pet => {
            if (pet.owerId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            pet.imageUrl = updatedImageUrl;
            pet.name = updatedname;
            pet.species = updatedSpecies;
            pet.breed = updatedBreed;
            pet.age = updatedAge;
            pet.gender = updatedGender;
            pet.activityLevel = updatedActivityLevel;
            pet.description = updatedDesc;
            pet.specialNeeds = updatedSpecialNeeds;
            pet.adoptionFee = updatedAdoptionFee;

            return pet.save().then(result => {
                console.log('UPDATED PET!');
                res.redirect('/admin/pets');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeletePet = (req, res, next) => {
    const petId = req.body.petId;
    Pet.deleteOne({
            _id: petId,
            owerId: req.user._id
        })
        .then(() => {
            console.log('DESTROYED PET REGISTRATION');
            res.redirect('/admin/pets');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


// exports.editBook = async (req, res, next) => {
//     try {
//         let book = req.params.isbn ? await Book.findOne({
//             isbn: req.params.isbn
//         }) : false;
//         if ((!book) && req.params.isbn) {
//             console.log("Book not found");
//             next();
//         } else renderBookEdit(req, res, book);
//     } catch (e) {
//         next(e);
//     }
// };

// exports.submitBook = async (req, res, next) => {
//     const changes = {
//         "isbn": req.body.isbn,
//         "title": req.body.title,
//         "subtitle": req.body.subtitle,
//         "author": req.body.author,
//         "description": req.body.description,
//         "price": req.body.price,
//         "image": req.body.image
//     }
//     var book = req.params.isbn ? await Book.findOne({
//         isbn: req.params.isbn
//     }) : null;
//     if (!book) {
//         book = new Book(changes);
//         book.owerId = req.user;
//     } else {
//         Object.assign(book, changes);
//         if (!book.owerId) book.owerId = req.user; //take ownership if none was assigned
//     }
//     if (validationResult(req).isEmpty() && book.isOwner(req.user._id)) {
//         book.save();
//         res.redirect('/book/' + book.isbn);
//     } else {
//         if (!book.isOwner(req.user._id)) {
//             console.log('User does not have ownership');
//             req.flash('message', {
//                 class: 'error',
//                 text: 'You do not have permission to edit this book'
//             });
//         } else {
//             console.log("failed validation");
//             req.flash('message', {
//                 class: 'error',
//                 text: 'Failed Validation'
//             });
//             validationBulder(req);
//         }
//         renderBookEdit(req, res, book);
//     }
// };

// exports.deleteBook = async (req, res, next) => {
//     try {
//         await Book.deleteOne({
//             isbn: req.body.isbn,
//             owerId: req.user._id
//         });
//         res.redirect('/');
//     } catch (e) {
//         next(e);
//     }
// }

// function renderBookEdit(req, res, book) {
//     const page = {
//         title: "Edit Book",
//         path: "/admin/add-book",
//         style: ["pretty", "form"],
//         message: req.flash('message')
//     }
//     res.render('admin/editBook.ejs', {
//         page: page,
//         book: book
//     });
// }