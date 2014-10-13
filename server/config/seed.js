/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Meal = require('../api/meal/meal.model');
var Ingredient = require('../api/ingredient/ingredient.model');
var Schedule = require('../api/schedule/schedule.model');
var ShoppingList = require('../api/shoppinglist/shoppinglist.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

var ObjectId = mongoose.Types.ObjectId;

var meal_id1 = new ObjectId();
var meal_id2 = new ObjectId();
var meal_id3 = new ObjectId();

Meal.find({}).remove(function() {
  Meal.collection.insert([{
    _id: meal_id1,
    name: 'Nitad gris',
    ingredients: [ { ingredientid: groundBeefId, name: "Nötfärs", amount: 3 } , { ingredientid: crushedTomatoesId, name: "Krossade tomater", amount: 2 } ],
    sides: []
  }, {
    _id: meal_id2,
    name: 'Chili con carne',
    ingredients: [ { name: 'Limabönor' }, { name: 'Högrev' }, { name: 'Röd chili' } ],
    sides: [ { name: 'Bostongurka' }]
  }, {
    _id: meal_id3,
    name: 'Fis på en pinne',
    ingredients: [ { name: 'Fiskpinnar' }, { name: 'Potatis' }, { name: 'Muskotnöt' } ],
    sides: [ { name: 'Morötter' }, { name: 'Remoulade'} ]
  }], function() { console.log('done inserting meals'); });
});

var groundBeefId = new ObjectId('542cdc4990ef693cb0083a24');
var crushedTomatoesId = new ObjectId('542cdc4990ef693cb0083a25');

Ingredient.find({}).remove(function() {
  Ingredient.create({
    _id: groundBeefId,
    name: "Köttfärs"
  }, {
    _id: crushedTomatoesId,
    name: "Krossade Tomater"
  }, {
    _id: new ObjectId('542cdc4990ef693cb0083a26'),
    name: "Högrev"
  }, {
    _id: new ObjectId('542cdc4990ef693cb0083a27'),
    name: "Tomatketchup"
  }, {
    _id: new ObjectId('542cdc4990ef693cb0083a28'),
    name: "Dijonsenap"
  }, {
    _id: new ObjectId('542cdc4990ef693cb0083a29'),
    name: "Spaghetti"
  });
});

var rightNow = Date.now();
var wednesday = new Date("2014-09-24T05:02:26.279Z");
var thursday = new Date("2014-09-25T05:02:26.279Z");

Schedule.find({}).remove(function () {
  Schedule.collection.insert([{
    name: "Mitt schema",
    config: {
      nbrDays: 14,
      days: [1, 2, 3, 4]
    },
    days: [{
        mealid: meal_id1,
        scheduled: true
      }, {
        mealid: meal_id3,
        scheduled: true
      }, {
        mealid: meal_id1,
        date: wednesday,
        scheduled: true
      }, {
        mealid: meal_id2,
        date: thursday,
        scheduled: true
      }, {
        mealid: null,
        scheduled: false
      }, {
        mealid: meal_id1,
        scheduled: false
      }, {
        mealid: meal_id1,
        scheduled: false
      }, {
        mealid: meal_id3,
        scheduled: true
      }, {
        mealid: null,
        scheduled: true
      }, {
        mealid: meal_id2,
        scheduled: true
      }, {
        mealid: meal_id1,
        scheduled: true
      }, {
        mealid: null,
        scheduled: true
      }, {
        mealid: meal_id3,
        scheduled: true
      }, {
        mealid: null,
        scheduled: false
      }]
    }], function() { console.log('done inserting schedule'); } );
});

ShoppingList.find({}).remove(function() {
  ShoppingList.collection.insert([{
    config: {
      nbrDays: 2,
      listMode: 'planning'
    },
    extras: [{
      name: 'Persilja'
    }, {
      name: 'Gräslök'
    }, {
      name: 'Högrev'
    }, {
      name: 'Tomatketchup'
    }, {
      name: 'Dijonsenap'
    }, {
      name: 'Spaghetti'
    }]
  }], function() { console.log('done inserting shoppinglist'); });
});