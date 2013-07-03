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

App.UserRecipesRoute = Ember.Route.extend({
    model:function(){
        return App.Recipe.find();
    }
});

App.UserRecipesController = Ember.ObjectController.extend({
    remove:function(itemid){
        var recipe = App.Recipe.find(itemid);
        recipe.set('active',false);
        // recipe.deleteRecord();
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
        }
    }
});

App.UserDetailRoute = Ember.Route.extend({
    model : function(params){
        return App.Recipe.find(params.id);
    }
});

App.Recipe = DS.Model.extend({
    title:   DS.attr('string'),
    active:  DS.attr('boolean'),
    ingredients: DS.attr('array')
});

App.Recipe.FIXTURES = [
 {
   id: 1,
   title: 'Chocolat aux pruneaux',
   active:true,
   ingredients:['chocolat','pruneaux']
 },
 {
   id: 2,
   title: 'Café frappé',
   active:true,
   ingredients:['café','glace']
 },
 {
   id: 3,
   title: 'Polenta sucrée',
   active:true,
   ingredients:['polenta','sucre']
 }
];