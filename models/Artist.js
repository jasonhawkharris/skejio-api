const mongoose = require('mongoose');
const User = require('./User');

const ArtistSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: true,
    },
    artistName: {
        type: String,
        default: null,
    },
    managerRate: {
        type: Number,
        default: 0,
        max: 1,
        min: 0,
    },
    agentRate: {
        type: Number,
        default: 0,
        max: 1,
        min: 0,
    },
    paidToDate: {
        type: Number,
        default: 0,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager',
        default: null,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        default: null,
    },
    mgmt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mgmt',
        default: null,
    },
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        default: null,
    },
    riders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],
    stageplots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],
    tours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
    }],
    tourdates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourdate',
    }],
    inventory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MerchItem'
    }]
});

const Artist = User.discriminator('Artist', ArtistSchema);
module.exports = Artist;