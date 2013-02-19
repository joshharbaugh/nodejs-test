exports = module.exports = function(app, mongoose) {

    var AuctionSchema = new mongoose.Schema({
        _id: String,
        last_modified: Date,
        realm: { name: String, slug: String },
        alliance: [ { _id: Number, realmCost: Number, available: Number } ],
        horde: [ { _id: Number, realmCost: Number, available: Number } ],
        neutral: [ { _id: Number, realmCost: Number, available: Number } ]
    });

    app.db.model('Auction', AuctionSchema);

}