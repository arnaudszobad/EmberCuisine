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
            // console.log(query);
            // console.log(type);
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

App.UserRecipesRoute = Ember.Route.extend({
    model:function(){
        return App.Recipe.find({active:1});
    }
});

App.UserRecipesController = Ember.ObjectController.extend({
    remove:function(item){
        var recipe = App.Recipe.find(item);
        recipe.set('active',0);

    }
});

App.UserCreateRoute = Ember.Route.extend({
    events:{
        createRecipe:function(){
            var title = this.get('controller.title');
            var newRecipe = App.Recipe.createRecord({title:title});
            newRecipe.save();
        }
    }
});

App.UserDetailRoute = Ember.Route.extend({
    model : function(params){
        // console.log(App.Recipe.find(params.id));
        return App.Recipe.find(params.id);
    }
});

App.Recipe = DS.Model.extend({
    title:   DS.attr('string'),
    active:  DS.attr('boolean')
});

App.Recipe.FIXTURES = [
 {
   id: 1,
   title: 'Chocolat aux pruneaux',
   active:1
 },
 {
   id: 2,
   title: 'Café frappé',
   active:0
 },
 {
   id: 3,
   title: 'Polenta sucrée',
   active:1
 }
];