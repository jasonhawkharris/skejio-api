const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    tourDate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourDate',
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    content: {
        type: String,
        required: true,
        maxlength: 300,
    },
}, {
    timestamps: true,
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;