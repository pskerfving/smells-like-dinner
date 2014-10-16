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
var meal_id4 = new ObjectId();

Meal.find({}).remove(function() {
  Meal.collection.insert([{
    _id: meal_id1,
    name: 'Nitad gris',
    ingredients: [
      { _id: groundBeefId, ingredientid: groundBeefId, name: "Nötfärs", amount: 3 },
      { _id: crushedTomatoesId, ingredientid: crushedTomatoesId, name: "Krossade tomater", amount: 2 } ],
    sides: []
  }, {
    _id: meal_id2,
    name: 'Chili con carne',
    ingredients: [
      { _id: limaBeansId, ingredientid: limaBeansId, name: 'Limabönor' },
      { _id: beefId, ingredientId: beefId, name: 'Högrev' },
      { _id: redChiliId, ingredientid: redChiliId, name: 'Röd chili' },
      { _id: nutmegId, ingredientid: nutmegId, name: 'Muskotnöt' } ],
    sides: [ { name: 'Bostongurka' }]
  }, {
    _id: meal_id3,
    name: 'Fis på en pinne',
    ingredients: [
      { _id: fishFingersId, ingredientid: fishFingersId, name: 'Fiskpinnar' },
      { _id: potatoesId, ingredientid: potatoesId, name: 'Potatis' },
      { _id: nutmegId, ingredientid: nutmegId, name: 'Muskotnöt' } ],
    sides: [ { name: 'Morötter' }, { name: 'Remoulade'} ]
  }, {
    _id: meal_id4,
    name: 'Klistergröt',
    ingredients: [],
    sides: []
  }], function() { console.log('done inserting meals'); });
});

var groundBeefId = new ObjectId('542cdc4990ef693cb0083a24');
var crushedTomatoesId = new ObjectId('542cdc4990ef693cb0083a25');
var beefId = new ObjectId('542cdc4990ef693cb0083a26');
var ketchupId = new ObjectId('542cdc4990ef693cb0083a27');
var mustardId = new ObjectId('542cdc4990ef693cb0083a28');
var spaghettiId = new ObjectId('542cdc4990ef693cb0083a29');
var limaBeansId = new ObjectId('542cdc4990ef693cb0083a30');
var redChiliId = new ObjectId('542cdc4990ef693cb0083a31');
var fishFingersId = new ObjectId('542cdc4990ef693cb0083a32');
var potatoesId = new ObjectId('542cdc4990ef693cb0083a33');
var nutmegId = new ObjectId('542cdc4990ef693cb0083a34');
var parsleyId = new ObjectId('542cdc4990ef693cb0083a35');
var grassUnionId = new ObjectId('542cdc4990ef693cb0083a36');

Ingredient.find({}).remove(function() {
  Ingredient.create({
    _id: groundBeefId,
    name: "Köttfärs"
  }, {
    _id: crushedTomatoesId,
    name: "Krossade Tomater"
  }, {
    _id: beefId,
    name: "Högrev"
  }, {
    _id: ketchupId,
    name: "Tomatketchup"
  }, {
    _id: mustardId,
    name: "Dijonsenap"
  }, {
    _id: spaghettiId,
    name: "Spaghetti"
  }, {
    _id: limaBeansId,
    name: "Lima bönor"
  }, {
    _id: redChiliId,
    name: "Röd Chili"
  }, {
    _id: fishFingersId,
    name: "Röd Chili"
  }, {
    _id: potatoesId,
    name: "Röd Chili"
  }, {
    _id: nutmegId,
    name: "Muskotnöt"
  }, {
    _id: parsleyId,
    name: "Persilja"
  }, {
    _id: grassUnionId,
    name: "Gräslök"
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
      nbrDays: 3,
      listMode: 'planning'
    },
    removed: [{
        ingredientid: beefId
      }, {
        ingredientid: fishFingersId
    }],
    extras: [{
        ingredientid: parsleyId
      }, {
        ingredientid: grassUnionId
      }, {
        ingredientid: beefId
      }, {
        ingredientid: ketchupId
      }, {
        ingredientid: mustardId
      }, {
        ingredientid: spaghettiId
    }]
  }], function() { console.log('done inserting shoppinglist'); });
});