const db = require('../models');
const AUTHORIZE = require('../middleware/authorized');


// GET index route
const index = (AUTHORIZE, (req, res) => {
    db.User.find({
        artistName: {
            $regex: req.query.artistName,
            $options: 'i'
        }
    }, (err, foundUsers) => {
        if (err) console.log('Error at users#index', err);
        if (!foundUsers) return res.status(404).json({
            message: 'No users exist.',
        });

        return res.status(200).json({
            users: foundUsers,
        });
    });
});


// GET show route
const show = (AUTHORIZE, (req, res) => {
    console.log('req object:', req);
    db.User.findById(req.userId).populate({
        path: 'manager agent artists tours tourdates notifications',
        populate: {
            path: 'tourdates teammates company agency',
        },
    }).exec((err, foundUser) => {
        if (err) console.log('Error at users#show');
        if (!foundUser) return res.status(404).json({
            message: 'Could not find this user.',
        })

        return res.status(200).json({
            user: foundUser,
        });
    });
});


// PUT update route
const update = (AUTHORIZE, async (req, res) => {
    const user = await db.User.findById(req.params.id);
    let userType;

    if (user.__t === 'Artist') {
        userType = db.Artist;
    } else if (user.__t === 'Manager') {
        userType = db.Manager;
    } else if (user.__t === 'Agent') {
        userType = db.Agent;
    } else if (user.__t === 'Teammate') {
        userType = db.Teammate;
    }

    try {
        userType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
            (err, updatedUser) => {
                if (err) console.log('Error at users#update:', error);
                if (!updatedUser) return res.status(404).json({
                    message: 'Could not find this user.',
                });

                return res.status(200).json({
                    updatedUser: updatedUser,
                });
            });
    } catch (error) {
        console.log(error);
    }

});


// DELETE destroy route
const destroy = (AUTHORIZE, async (req, res) => {
    try {
        const user = await db.User.findById(req.params.id);

        if (user.__t === 'Artist') {
            await db.Tour.deleteMany({ artist: req.params.id });
        }

        await db.Thread.deleteMany({ user: req.params.id });
        await db.Comment.deleteMany({ user: req.params.id });
        await db.Todos.deleteMany({ user: req.params.id });

        await db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
            if (err) console.log('Error at users#destroy');
            if (!deletedUser) return res.status(404).json({
                message: 'Could not find this user.',
            })

            return res.status(200).json({
                deletedUser: deletedUser,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong. Try again.',
        });
    }
})




// exports
module.exports = {
    index,
    show,
    update,
    destroy,
}