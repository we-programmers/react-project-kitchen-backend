var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload user profile on routes with ':username'
router.param('username', function (req, res, next, username) {
  User.findOne({ username: username })
    .then(function (user) {
      if (!user) {
        return res.sendStatus(404);
      }

      req.profile = user;

      return next();
    })
    .catch(next);
});

router.get('/:username', auth.optional, function (req, res, next) {
  /*  #swagger.responses[200] = {
            description: 'Profile successfully loaded.',
            schema: { $ref: "#/definitions/Profile" }
      }
      #swagger.parameters['username'] = {
                in: 'path',
                description: 'User name',
                required: true,
      }
      #swagger.tags = ['Profile']
      #swagger.summary = 'Получить профиль пользователя [на фронте - getProfile()]'
  */
  if (req.payload) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
      }

      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

router.post('/:username/follow', auth.required, function (req, res, next) {
    /* #swagger.responses[200] = {
            description: 'Profile successfully followed.',
            schema: { $ref: "#/definitions/NewFollowing" }
    } 
    #swagger.security = [{
              "bearerAuth": []
    }]
    #swagger.parameters['authorization'] = {
                in: 'headers',
                description: 'Token',
                required: true,
    }
    #swagger.parameters['username'] = {
                in: 'path',
                description: 'User name',
                required: true,
    }
    #swagger.tags = ['Profile']
    #swagger.summary = 'Зафолловить пользователя [на фронте - followUser()]'
  */
  var profileId = req.profile._id;

  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.follow(profileId).then(function () {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
});

router.delete('/:username/follow', auth.required, function (req, res, next) {
    /* #swagger.responses[200] = {
            description: 'Profile successfully unfollowed.',
            schema: { $ref: "#/definitions/Profile" }
    } 
    #swagger.security = [{
              "bearerAuth": []
    }]
    #swagger.parameters['authorization'] = {
                in: 'headers',
                description: 'Token',
                required: true,
    }
    #swagger.parameters['username'] = {
                in: 'path',
                description: 'User name',
                required: true,
    }
    #swagger.tags = ['Profile']
    #swagger.summary = 'Отфолловить пользователя [на фронте - unfollowUser()]'
  */
  var profileId = req.profile._id;

  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return user.unfollow(profileId).then(function () {
        return res.json({ profile: req.profile.toProfileJSONFor(user) });
      });
    })
    .catch(next);
});

module.exports = router;
