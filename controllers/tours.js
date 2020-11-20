const db = require('../models');
const errors = require('../utils/errors');
const { checkPrivilage, adjustParams } = require('../utils/utilities');



/**
 * @NOTE index will be called differently on the front end
 * model depending on what type of account is calling it.
 * if an artist account is calling it, they will call it without a query.
 * otherwise, they will call it with a query specifying the artist.
 * @param {*} req 
 * @param {*} res 
 */
const index = async (req, res) => {
    try {
        const user = await db.User.findById(req.userId);
        if (user.__t === 'Artist') {
            // NOTE: when it comes time to add tourdates, populate this.
            db.Tour.find({ artist: req.userId }, (err, foundTours) => {
                if (err) console.log('Error at Tours#index');
                if (!foundTours.length) return res.status(404).json({
                    msg: 'Found no tours for this artist.',
                });

                return res.status(200).json({
                    tours: foundTours,
                });
            });
        } else if (user.__t === 'Manager' || user.__t === 'Agent') {
            if (!user.artists.includes(req.query.artist)) {
                return res.status(403).json({
                    msg: errors.UNAUTHORIZED,
                });
            }

            db.Tour.find(req.query, (err, foundTours) => {
                if (err) console.log('Error at Tours#index');
                if (!foundTours.length) return res.status(404).json({
                    msg: 'Found no tours for this artist.',
                });

                return res.status(200).json({
                    tours: foundTours,
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
}




/**
 * @NOTE: Shows a single tour date only.
 * @param {*} req 
 * @param {*} res 
 */
const show = async (req, res) => {
    try {
        const user = await db.User.findById(req.userId);

        db.Tour.findById(req.params.id, (err, foundTour) => {
            if (err) console.log('Error at tours#show');
            if (!foundTour) return res.status(404).json({
                msg: 'Could not find any tours.',
            });

            if (user.__t === 'Artist') {
                if (foundTour.artist == req.userId) {
                    return res.status(200).json({
                        foundTour: foundTour,
                    });
                } else {
                    return res.status(403).json({
                        msg: errors.UNAUTHORIZED,
                    });
                }
            } else if (user.__t === 'Manager' || user.__t === 'Agent') {
                if (user.artists.includes(foundTour.artist)) {
                    return res.status(200).json({
                        foundTour: foundTour,
                    });
                } else {
                    return res.status(403).json({
                        msg: errors.UNAUTHORIZED,
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * @NOTE For the front end: 
 * if the user is a manager or agent, form will need a drop down
 * populated with artists registered to that agent or manager.
 * if the user is an artist, form only need a name field.
 * if the user is a teammate, They shouldn't even be able 
 * to access the form.
 * 
 * if the account creating the tour is not connected to 
 * the artist in the request, they will not be allowed to create
 * the tour.
 * @param {*} req 
 * @param {*} res 
 */
const create = async (req, res) => {
    try {
        const user = await db.User.findById(req.userId);
        const authorized = adjustParams(req, user);

        if (!authorized) return res.status(403).json({
            msg: errors.UNAUTHORIZED,
        });

        db.Tour.create(req.body, async (err, newTour) => {
            if (err) console.log(`Error at Tour#create ${err}`);
            if (!newTour) return res.status(400).json({
                msg: 'Bad request. Try again. :)',
            });

            if (user.__t === 'Artist') {
                user.tours.push(newTour._id);
                user.save();
            } else {
                const artist = await db.Artist.findById(req.body.artist);
                artist.tours.push(newTour._id);
                artist.save();
            }

            return res.status(201).json({
                newTour: newTour,
            });
        });
    } catch (error) {
        console.log(error);
    }
}


// const checkPrivilage = (req, user, model) => {
//     if (user.__t === 'Teammate') {
//         return false;
//     } else if (user.__t === 'Artist') {
//         if (req.userId != model.artist) {
//             return false;
//         }
//     } else if (user.__t === 'Manager' || user.__t === 'Agent') {
//         if (!user.artists.includes(model.artist)) {
//             return false;
//         }
//     }

//     return true;
// }


const update = async (req, res) => {
    try {
        const user = await db.User.findById(req.userId);
        const tour = await db.Tour.findById(req.params.id);
        const authorized = checkPrivilage(req, user, tour);

        if (!authorized) return res.status(403).json({
            msg: errors.UNAUTHORIZED,
        });

        await db.Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
            (err, savedTour) => {

                if (err) console.log('Error at Tour#update');
                if (!savedTour) return res.status(404).json({
                    msg: 'Cannot update tour that does not exist. :-(',
                });

                return res.status(200).json({
                    savedTour: savedTour
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
}



const destroy = async (req, res) => {
    try {
        const user = await db.User.findById(req.userId);
        const tour = await db.Tour.findById(req.params.id);
        const authorized = checkPrivilage(req, user, tour);

        if (!authorized) return res.status(403).json({
            msg: errors.UNAUTHORIZED,
        });

        await db.Tour.findByIdAndDelete(req.params.id, async (err, deletedTour) => {
            if (err) console.log('Error at Tour#delete');
            if (!deletedTour) return res.status(404).json({
                msg: 'Not found.',
            });

            const artist = await db.Artist.findById(deletedTour.artist);
            const index = artist.tours.indexOf(deletedTour._id);
            artist.tours.splice(index, 1);
            artist.save();

            return res.status(200).json({
                deletedTour: deletedTour,
            });
        });
    } catch (error) {
        console.log(error);
    }
}





module.exports = {
    index,
    show,
    create,
    update,
    destroy,
}