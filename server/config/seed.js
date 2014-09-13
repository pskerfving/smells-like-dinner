/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

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

Meal.find({}).remove(function() {
  Meal.collection.insert([{
    _id: '540fe377bd02b01c311e5b8c',
    name: 'Nitad gris',
    ingredients: [ { name: 'Nötfärs' }, { name: 'Krossade tomater' }, { name: 'Gul lök' } ],
    sides: []
  }, {
    _id: '540fe377bd02b01c311e5b8d',
    name: 'Chili con carne',
    ingredients: [ { name: 'Limabönor' }, { name: 'Högrev' }, { name: 'Röd chili' } ],
    sides: [ { name: 'Bostongurka' }]
  }, {
    _id: '540fe377bd02b01c311e5b8e',
    name: 'Fis på en pinne',
    ingredients: [ { name: 'Fiskpinnar' }, { name: 'Potatis' }, { name: 'Muskotnöt' } ],
    sides: [ { name: 'Morötter' }, { name: 'Remoulade'} ]
  }], function() { console.log('done inserting meals'); });
});

Ingredient.find({}).remove(function() {
  Ingredient.create({
    name: "Persilja"
  }, {
    name: "Gräslök"
  }, {
    name: "Högrev"
  }, {
    name: "Tomatketchup"
  }, {
    name: "Dijonsenap"
  }, {
    name: "Spaghetti"
  });
});

Schedule.find({}).remove(function () {
  Schedule.collection.insert([{
    name: "Mitt schema",
    config: {
      nbrDays: 14,
      days: [1, 2, 3, 4]
    },
    days: [{
        mealid: '540fe377bd02b01c311e5b8d'
      }, {
        mealid: '540fe377bd02b01c311e5b8e'
      }, {
        mealid: '540fe377bd02b01c311e5b8c'
      }, {
        mealid: 0
      }, {
        mealid: 0
      }, {
        mealid: '540fe377bd02b01c311e5b8c'
      }, {
        mealid: '540fe377bd02b01c311e5b8e'
      }, {
        mealid: '540fe377bd02b01c311e5b8d'
      }, {
        mealid: 0
      }, {
        mealid: '540fe377bd02b01c311e5b8e'
      }, {
        mealid: '540fe377bd02b01c311e5b8c'
      }, {
        mealid: 0
      }, {
        mealid: '540fe377bd02b01c311e5b8d'
      }, {
        mealid: 0
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