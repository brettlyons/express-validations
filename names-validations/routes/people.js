var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/validpeople');
var people = db.get('validpeople');
// Remember all these routes are linked at /people/<route>
// so
/* GET /people */
router.get('/', function(req, res, next){
    //var peopleList = [{name: "some name", hobby: "some hobby"}];
    people.find({}, function(err, peopleList) {
      res.render('peoplelist', { peopleList: peopleList });
    });
});

/* GET /people/new */
router.get('/new', function(req, res, next) {
  res.render('newperson', {title: 'Name holder', errors: null});
});
/*POST /people/new */
router.post('/new', function(req, res, next) {
  var errors = [];
  if(req.body.name.trim().length == 0) {
    errors.push("You must fill in a name");
  }
  else if(req.body.hobby.trim().length ==0) {
    errors.push("You must fill in a hobby");
  }
  if(req.body.name.trim().length != 0) {
     people.find({ name: req.body.name }, function(err, dbEntries) {
       console.log(dbEntries);
      if(dbEntries.length == 0 && errors.length == 0)  {
        console.log("dbEntries shouldn't exist here", dbEntries);
          people.insert({
            name: req.body.name,
            hobby: req.body.hobby
          }, function(err, response) {
            res.redirect('/people');
          });
        }
        else if(req.body.name === dbEntries[0].name) {
          errors.push("Name field must be unique");
        }
        if(errors.length > 0) {
          reportErrors(req.body);
        }
     });
  }
    function reportErrors(fields) {
      res.render('newperson', {title: "Name Holder With Errors", name: fields.name, hobby: fields.hobby, errors: errors})
    }
});

module.exports = router;
