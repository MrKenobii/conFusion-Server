const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors')

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userId: req.user.id})
    .populate('userId')
    .populate('dishIds')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userId: req.user.id})
    .then(favorites => {
        if(!favorites) {
            Favorites.create({userId: req.user.id, dishIds: req.body})
            .then(favorites => {
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, err => next(err))
            .catch(err => next(err));
        }
        else {
            for(dish of req.body) {
                if(favorites.dishIds.indexOf(dish._id) === -1) {
                    favorites.dishIds = favorites.dishIds.concat(dish._id);
                }
            }
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, err => next(err))
            .catch(err => next(err));
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteMany({userId: req.user.id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, err => next(err))
    .catch(err => next(err));
});

favoriteRouter.route('/:dishId/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userId: req.user.id})
    .then(favorites => {
        if(favorites.dishIds.indexOf(req.params.dishId) === -1) {
            favorites.dishIds = favorites.dishIds.concat(req.params.dishId);
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, err => next(err))
            .catch(err => next(err));
        }
        else {
            res.statusCode = 304;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }
    }, err => next(err))
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userId: req.user.id})
    .then(favorites => {
        let index = favorites.dishIds.indexOf(req.params.dishId);
        if(index !== -1) {
            favorites.dishIds.splice(index, 1);
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, err => next(err))
            .catch(err => next(err));
        }
        else {
            res.statusCode = 304;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }
    }, err => next(err))
    .catch(err => next(err));
});

module.exports = favoriteRouter;