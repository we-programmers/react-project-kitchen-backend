var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

// return a list of tags
router.get('/', function(req, res, next) {
    /* #swagger.responses[200] = {
            description: 'Tags successfully loaded.',
            schema: { tags: ['tag1', 'tag2', 'tag3'], }
    } 
    #swagger.tags = ['Tags']
    #swagger.summary = 'Получить список всех тегов на сайте [на фронте - getTags()]'
  */
  Article.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
