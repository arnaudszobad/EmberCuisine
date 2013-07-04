// Ember.LOG_BINDINGS = true;

App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.resource('user',function(){
    this.route('recipes');
    this.route('create');
    this.route('detail',{path:'/detail/:recipe_id'});
  });
});

App.Store = DS.Store.extend({
    revision: 12,
    adapter: DS.FixtureAdapter.extend({
        queryFixtures: function(fixtures, query, type){
            return fixtures.filter(function(item){
                for(prop in query){
                    if(item[prop] != query[prop]){
                        return false;
                    }
                }
                return true;
            });
        }
    })
});

// ####### ROUTES #######
// App.UserRoute = ember.Route.extend({
//     renderTemplate:function(){
//         this.render("user/recipes");
//     }
// })

App.UserRecipesRoute = Ember.Route.extend({
    model:function(){
        return App.Recipe.find();
    },
    events:{
        remove:function(itemid){
            var recipe = App.Recipe.find(itemid);
            recipe.set('active',false);
            // recipe.deleteRecord();
        }
    }
});

App.UserCreateRoute = Ember.Route.extend({
    model:function(){
        return Ember.Object.extend();
    },
    events:{
        save:function(){
            var title = this.get('controller.title');
            var isactive = this.get('controller.active');
            if(isactive == undefined) isactive = false;
            var newRecipe = App.Recipe.createRecord({title:title,active:isactive});
            newRecipe.save();
        },
        addingredient:function(){

        }
    }
});

App.UserDetailRoute = Ember.Route.extend({
    model : function(params){
        return App.Recipe.find(params.id);
    }
});

// ####### CONTROLLERS #######


// ####### FIXTURES #######
App.Ingredients = DS.Model.extend({
    ing:   DS.attr('string'),
    recipe:DS.belongsTo('App.Recipe')
});
App.Ingredients.FIXTURES = [
{
    id: 1,
    ing: 'chocolat'
},
{
    id: 2,
    ing: 'pruneaux'
},
{
    id: 3,
    ing: 'sucre'
},
{
    id: 4,
    ing: 'café'
},
{
    id: 5,
    ing: 'glace'
},
{
    id: 6,
    ing: 'polenta'
},
{
    id: 7,
    ing: 'vanille'
},
{
    id: 8,
    ing: 'fraise'
},
{
    id: 9,
    ing: 'mûres'
}
];

App.Recipe = DS.Model.extend({
    title:   DS.attr('string'),
    active:  DS.attr('boolean'),
    ingredients: DS.hasMany('App.Ingredients')
});
App.Recipe.FIXTURES = [
 {
   id: 1,
   title: 'Chocolat aux pruneaux',
   active:true,
   ingredients:[1,2]
 },
 {
   id: 2,
   title: 'Café frappé',
   active:true,
   ingredients:[4,5]
 },
 {
   id: 3,
   title: 'Polenta sucrée',
   active:true,
   ingredients:[6,3,7,2]
 }
];


