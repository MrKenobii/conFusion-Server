var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Favorites = require("../models/favorite");
var authenticate = require("../authenticate");

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .get(authenticate.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._id;

    Favorites.findOne({
      postedBy: userId,
    })
      .populate("postedBy dishes")
      .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
      });
  })
  .post(authenticate.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._id;

    Favorites.findOneAndUpdate(
      {
        postedBy: userId,
      },
      {
        $addToSet: {
          dishes: req.body,
        },
      },
      {
        upsert: true,
        new: true,
      },
      function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      }
    );
  })
  .delete(authenticate.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._id;

    Favorites.findOneAndRemove(
      {
        postedBy: userId,
      },
      function (err, resp) {
        if (err) throw err;
        res.json(resp);
      }
    );
  });

favoriteRouter
  .route("/:dishId")
  .delete(authenticate.verifyOrdinaryUser, function (req, res, next) {
    var userId = req.decoded._id;

    Favorites.findOneAndUpdate(
      {
        postedBy: userId,
      },
      {
        $pull: {
          dishes: req.params.dishId,
        },
      },
      {
        new: true,
      },
      function (err, favorite) {
        if (err) throw err;

        res.json(favorite);
      }
    );
  });

module.exports = favoriteRouter;
