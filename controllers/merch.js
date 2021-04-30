const db = require('../models');

const index = async (req, res) => {
    try {
        db.MerchItem.find(
            { artist: req.userId },
            (err, foundItems) => {
                if (err) console.log('error at merch#index', err);
                if (!foundItems.length) return res.status(404).json({
                    msg: 'Could not find any merch items'
                })

                return res.status(200).json({
                    merch: foundItems
                });
            });
    } catch (error) {
        console.log(error);
    }
}


const create = async (req, res) => {
    const artist = await db.Artist.findById(req.userId);

    try {
        db.MerchItem.create(req.body, (err, createdMerchItem) => {
            if (err) console.log('error at merch#create', err);
            if (!createdMerchItem) return res.status(400).json({
                msg: 'Unable to create merch item.'
            });

            artist.inventory.push(createdMerchItem);
            artist.save();

            return res.status(201).json({
                msg: 'Successfully created merch item',
                item: createdMerchItem
            });
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    index,
    create
}