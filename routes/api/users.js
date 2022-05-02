var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/user', auth.required, function (req, res, next) {
  /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: { $ref: "#/definitions/Auth" }
    }
    #swagger.parameters['authorization'] = {
                in: 'headers',
                description: 'Token',
                required: true,
    }
    #swagger.security = [{
              "bearerAuth": []
    }]

    #swagger.tags = ['User']
    #swagger.summary = 'Получить данные пользователя [на фронте - getUser()]'
  */
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put('/user', auth.required, function (req, res, next) {
  /* #swagger.responses[200] = {
            description: 'User successfully updated.',
            schema: { $ref: "#/definitions/Auth" }
    } 
    #swagger.security = [{
              "bearerAuth": []
    }]
    #swagger.parameters['authorization'] = {
                in: 'headers',
                description: 'Token',
                required: true,
    }
    #swagger.parameters['user'] = {
                in: 'body',
                description: 'User data.',
                required: true,
                schema: {
                  "user" : {
                    "username": "John Smith",
                    "email": "john@gmail.com",
                    "bio": "My name is John",
                    "password": "newPassword123",
                    "image": "https://static.productionready.io/images/smiley-cyrus.jpg"
                  }
                }
    }
    #swagger.tags = ['User']
    #swagger.summary = 'Обновить данные пользователя [на фронте - patchUser()]'
  */
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== 'undefined') {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.bio !== 'undefined') {
        user.bio = req.body.user.bio;
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.password !== 'undefined') {
        user.setPassword(req.body.user.password);
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.post('/users/login', function (req, res, next) {
  /*  #swagger.responses[200] = {
            description: 'User successfully logged in.',
            schema: { $ref: "#/definitions/Auth" }
      }
      #swagger.parameters['user'] = {
                in: 'body',
                description: 'User email.',
                required: true,
                type: 'string',
                schema: {
                  user : {
                    email: "john@gmail.com",
                    password: "myPassword"
                  }
                }
      }
      #swagger.tags = ['User']
      #swagger.summary = 'Авторизоваться [на фронте - signIn()]'
  */
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate(
    'local',
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (user) {
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    },
  )(req, res, next);
});

router.post('/users', function (req, res, next) {
  /*  #swagger.responses[200] = {
            description: 'User successfully registered.',
            schema: { $ref: "#/definitions/Auth" }
      }
      #swagger.parameters['user'] = {
                in: 'body',
                description: 'User data.',
                required: true,
                schema: {
                  "user": {
                    "username": "John_Smith",
                    "email": "john@gmail.com",
                    "password": "password123",
                  }
                }
    }
      #swagger.tags = ['User']
      #swagger.summary = 'Зарегистрироваться [на фронте - register()]'
  */

  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function () {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

module.exports = router;
