var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passporLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passporLocalMongoose);

module.exports = mongoose.model('User', User);