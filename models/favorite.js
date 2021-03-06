var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    unique: true
  }],
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

var Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;