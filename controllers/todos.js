const db = require('../models');

const index = (req, res) => {
    try {
        db.Todo.find({ user: req.userId })
            .populate({
                path: 'user artist createdBy tourdate'
            }).exec((err, foundTodos) => {
                if (err) console.log(err);
                if (!foundTodos) res.status(404).json({
                    msg: 'found no todos matching this query.'
                });

                res.status(200).json({
                    foundTodos: foundTodos,
                });
            });
    } catch (error) {
        console.log(error);
    }
}

const show = (req, res) => {
    try {
        db.Todo.findById(req.params.id).populate({
            path: 'user artist createdBy tourdate'
        }).exec((err, foundTodo) => {
            if (err) console.log(err);
            if (!foundTodo) return res.status(404).json({
                msg: 'Todo with this id not found',
            });

            return res.status(200).json({
                foundTodo: foundTodo,
            });
        });
    } catch (error) {
        console.log(error);
    }
}

const create = (req, res) => {
    // Need authorization for this one.
    try {
        db.Todo.create(req.body, async (err, createdTodo) => {
            if (err) console.log(err);
            if (!createdTodo) return res.status(400).json({
                msg: 'Bad request. Try again.'
            });

            const user = await db.User.findById(req.body.user);
            const tourdate = await db.Tourdate.findById(req.body.tourdate);
            user.todos.push(createdTodo._id);
            tourdate.todos.push(createdTodo._id);

            user.save();
            tourdate.save();

            return res.status(201).json({
                createdTodo: createdTodo,
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

}