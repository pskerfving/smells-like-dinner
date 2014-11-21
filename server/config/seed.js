/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var User = require('../api/user/user.model');
var Invite = require('../api/invite/invite.model');
var Meal = require('../api/meal/meal.model');
var Category = require('../api/category/category.model');
var Ingredient = require('../api/ingredient/ingredient.model');
var Schedule = require('../api/schedule/schedule.model');
var ShoppingList = require('../api/shoppinglist/shoppinglist.model');

var ObjectId = mongoose.Types.ObjectId;

var testUser1_id = new ObjectId();
var testUser2_id = new ObjectId();
var testUser3_id = new ObjectId();

var testUser1_schedule_id = new ObjectId();
var testUser1_shoppinglist_id = new ObjectId();

User.find({}).remove(function() {
  User.create({
    _id: testUser1_id,
    provider: 'local',
    name: 'Test User 1',
    email: 'test1@test.com',
    password: 'test1',
    schedule: testUser1_schedule_id,
    shoppinglist: testUser1_shoppinglist_id
  }, {
    _id: testUser2_id,
    provider: 'local',
    name: 'Test User 2',
    email: 'test2@test.com',
    password: 'test2'
  }, {
    _id: testUser3_id,
    provider: 'local',
    name: 'Kompis',
    email: 'test3@test.com',
    password: 'test3',
    friends: [ testUser1_id ]
  },{
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

Invite.find({}).remove(function() {
  Invite.create({
      inviter_name: 'Test User 1',
      invitee_email: 'test2@test.com',
      schedule: testUser1_schedule_id,
      expired: false
    }, function() {
    console.log('finished adding invites');
  })
});

var meal_id1 = new ObjectId();
var meal_id2 = new ObjectId();
var meal_id3 = new ObjectId();
var meal_id4 = new ObjectId();

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


Meal.find({}).remove(function() {
  Meal.collection.insert([{
    _id: meal_id1,
    user_id: testUser1_id,
    name: 'Nitad gris',
    ingredients: [
      { ingredientid: groundBeefId, amount: 3 },
      { ingredientid: crushedTomatoesId, amount: 2 } ]
  }, {
    _id: meal_id2,
    name: 'Chili con carne',
    user_id: testUser1_id,
    ingredients: [
      { ingredientid: limaBeansId },
      { ingredientid: beefId },
      { ingredientid: redChiliId },
      { ingredientid: nutmegId } ]
  }, {
    _id: meal_id3,
    name: 'Fis på en pinne',
    user_id: testUser2_id,
    ingredients: [
      { ingredientid: fishFingersId },
      { ingredientid: potatoesId },
      { ingredientid: nutmegId } ]
  }, {
    _id: meal_id4,
    name: 'Klistergröt',
    user_id: null,
    ingredients: []
  }], function() { console.log('done inserting meals'); });
});

var vegetablesId = new ObjectId('542cdc4990ef693cb0083a37');
var meatId = new ObjectId('542cdc4990ef693cb0083a38');
var spicesId = new ObjectId('542cdc4990ef693cb0083a39');
var froozenId = new ObjectId('542cdc4990ef693cb0083a40');
var dryId = new ObjectId('542cdc4990ef693cb0083a41');
var waterId = new ObjectId('542cdc4990ef693cb0083a42');

Category.find({}).remove(function() {
  Category.create({
    _id: vegetablesId,
    name: "Grönsaker",
    rank: 1
  }, {
    _id: meatId,
    name: "Kött",
    rank: 2
  }, {
    _id: spicesId,
      name: "Kryddor",
    rank: 3
  }, {
    _id: froozenId,
    name: "Frysvaror",
    rank: 4
  }, {
    _id: dryId,
    name: "Torrvaror",
    rank: 5
  }, {
    _id: waterId,
    name: "Vatten och dricka",
    rank: 6
  });
});


Ingredient.find({}).remove(function() {
  Ingredient.create({
    _id: groundBeefId,
    name: "Köttfärs",
    category_id: meatId
  }, {
    _id: crushedTomatoesId,
    name: "Krossade Tomater",
    category_id: null
  }, {
    _id: beefId,
    name: "Högrev",
    category_id: meatId
  }, {
    _id: ketchupId,
    name: "Tomatketchup",
    category_id: null
  }, {
    _id: mustardId,
    name: "Dijonsenap",
    category_id: null
  }, {
    _id: spaghettiId,
    name: "Spaghetti",
    category_id: null
  }, {
    _id: limaBeansId,
    name: "Lima bönor",
    category_id: null
  }, {
    _id: redChiliId,
    name: "Röd Chili",
    category_id: vegetablesId
  }, {
    _id: fishFingersId,
    name: "Fiskpinnar",
    category_id: froozenId
  }, {
    _id: potatoesId,
    name: "Potatis",
    category_id: vegetablesId
  }, {
    _id: nutmegId,
    name: "Muskotnöt",
    category_id: spicesId
  }, {
    _id: parsleyId,
    name: "Persilja",
    category_id: vegetablesId
  }, {
    _id: grassUnionId,
    name: "Gräslök",
    category_id: vegetablesId
  });
});

var rightNow = Date.now();
var wednesday = new Date("2014-09-24T05:02:26.279Z");
var thursday = new Date("2014-09-25T05:02:26.279Z");

Schedule.find({}).remove(function () {
  Schedule.collection.insert([{
      name: "Exempel schema",
      user_id: null,
      config: {
        nbrDays: 7,
        days: [1, 2, 3, 4, 5]
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
      }]
    }, {
    _id: testUser1_schedule_id,
    name: "Mitt schema",
    user_id: testUser1_id,
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
    user_id: null,
    config: {
      nbrDays: 2,
      listMode: 'planning'
    },
    removed: [],
    picked: [],
    extras: []
  }, {
    _id: testUser1_shoppinglist_id,
    user_id: testUser1_id,
    config: {
      nbrDays: 7,
      listMode: 'planning'
    },
    removed: [{
      ingredientid: beefId
    }, {
      ingredientid: fishFingersId
    }],
    picked: [{
      ingredientid: potatoesId
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
  }], function() { console.log('done inserting shoppinglists'); });
});