const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    tourDates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourDate',
    }],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    },
    complete: {
        type: Boolean,
        default: false,
    },
    gross: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;