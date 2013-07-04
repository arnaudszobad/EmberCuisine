// Ember.LOG_BINDINGS = true;

App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route('create');
  this.resource('user',function(){
    this.route('edit',{path:'/edit/:user_id'});
    this.route('recipes');
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
App.UserRoute = Ember.Route.extend({
    model:function(){
        return App.User.find();
    }
});

App.UserEditRoute = Ember.Route.extend({
    model:function(item){
        console.log(item);
         return App.User.find(item.id);
    }
});

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

App.UserDetailRoute = Ember.Route.extend({
    model : function(params){
        return App.Recipe.find(params.id);
    }
});

App.CreateRoute = Ember.Route.extend({
    setupController:function(controller,model){
        // affectation du model au controller pour accès facilité
        controller.set('model',App.Recipe.createRecord());
    },
    deactivate:function(){
        // rollback quand on quitte la route, si le model est dirty
        if(this.get('controller.model') && this.get('controller.model').get("isDirty")){
            this.get('controller.model').get("transaction").rollback();
        }
    },
    events:{
        save:function(){
            // pas de sauvegarde sans titre
            if(this.get("controller.model.title")){
                this.get('controller.model').save();
            }
        },
        addingredient:function(){
            // ajout d'un record au model Recipe --> ajout d'un champ input dans l'interface
            this.get('controller.model.ingredients').pushObject(App.Ingredients.createRecord());
        },
        removeingredient:function(item){
            // suppression d'un ingrédient
            this.get('controller.model.ingredients').removeObject(item);
        }
    }
});



// ####### CONTROLLERS #######


// ####### FIXTURES #######
App.User = DS.Model.extend({
    nom: DS.attr("string"),
    prenom: DS.attr("string"),
    recipes:DS.hasMany("App.Recipe")
})
App.User.FIXTURES = [
{
    id:1,
    nom:"Szobad",
    prenom:"Arnaud",
    recipes:[1,4]
},
{
    id:2,
    nom:"Maubourguet",
    prenom:"Nicolas",
    recipes:[2,6]
},
{
    id:3,
    nom:"Adjeroud",
    prenom:"Lotfi",
    recipes:[3,5,7]
}
];

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
    rating:  DS.attr('integer'),
    ingredients: DS.hasMany('App.Ingredients'),
    user: DS.belongsTo("App.User")
});
App.Recipe.FIXTURES = [
 {
   id: 1,
   title: 'Chocolat aux pruneaux',
   active:true,
   ingredients:[1,2],
   user:1
 },
 {
   id: 2,
   title: 'Chocolat aux pruneaux',
   active:true,
   ingredients:[1,2],
   user:2
 },
 {
   id: 3,
   title: 'Chocolat aux pruneaux',
   active:true,
   ingredients:[1,2],
   user:3
 },
 {
   id: 4,
   title: 'Café frappé',
   active:true,
   ingredients:[4,5],
   user:1
 },
 {
   id: 5,
   title: 'Café frappé',
   active:true,
   ingredients:[4,5],
   user:3
 },
 {
   id: 6,
   title: 'Polenta sucrée',
   active:true,
   ingredients:[6,3,7,2],
   user:2
 },
 {
   id: 7,
   title: 'Polenta sucrée',
   active:true,
   ingredients:[6,3,7,2],
   user:3
 }
];


