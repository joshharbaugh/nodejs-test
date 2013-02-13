exports = module.exports = function(app, mongoose) {

    var AuctionSchema = new mongoose.Schema({
        _id: String,
        realm: { name: String, slug: String },
        alliance: [ { _id: Number, realmCost: Number } ],
        horde: [ { _id: Number, realmCost: Number } ],
        neutral: [ { _id: Number, realmCost: Number } ]
        //alliance: [ { auc: Number, item: Number, owner: String, bid: Number, buyout: Number, quantity: Number, timeLeft: String } ],
        //horde: [ { auc: Number, item: Number, owner: String, bid: Number, buyout: Number, quantity: Number, timeLeft: String } ],
        //neutral: [ { auc: Number, item: Number, owner: String, bid: Number, buyout: Number, quantity: Number, timeLeft: String } ]
    });

    app.db.model('Auction', AuctionSchema);

}