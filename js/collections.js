/**
 * Created by Riter on 20/10/14.
 */

Solana.Collections.Videos = Backbone.Collection.extend({
    url: api_host + '/listarVideos',
    model: Solana.Models.Videos,
    loading:false,
    initialize:function(){
        this._attributes = {page:1,limit:20};
    },
    attr: function(prop, value) {
        return  value === undefined ? this._attributes[prop] : this._attributes[prop] = value;
    },
    loadMore : function(callback){
        var self = this;
        if(parseInt(self.attr('page'))>0 && !this.loading){
            this.loading = true;
            this.fetch({data: $.param(this._attributes),
                success: function(model, response, options){
                    self.loading = false;
                    if(typeof callback == 'function')
                        callback();
                },error:function(){
                    self.loading = false;
                }
            });
        }
    },
    parse:function(response){
        if(response.datos.length > 0){
            _.each(response.datos,function(videos){
                var model = new Solana.Models.Videos();
                model.set(videos.Video);
                this.add(model);
            },this);
        }
        return this.models;
    }
});

Solana.Collections.ItemLists = Backbone.Collection.extend({
    model: Solana.Models.ItemList,
    loading:false,
    initialize:function(){
        this._attributes = {page:1,limit:30};
    },
    attr: function(prop, value) {
        return  value === undefined ? this._attributes[prop] : this._attributes[prop] = value;
    },
    loadMore : function(callback){
        var self = this;
        if(parseInt(self.attr('page'))>0 && !this.loading){
            this.loading = true;
            this.fetch({data: $.param(this._attributes),
                success: function(model, response, options){
                    self.loading = false;
                    if(typeof callback == 'function')
                        callback();
                },error:function(){
                    self.loading = false;
                }
            });
        }
    },
    parse:function(response){
        if(response.datos.length > 0){
            _.each(response.datos,function(item){
                var model = new Solana.Models.ItemList();
                model.set(item[_.keys(item)[0]]);
                this.add(model);
            },this);
        }
        return this.models;
    }
});

Solana.Collections.Favorites = Backbone.Collection.extend({
    model: Solana.Models.DAS
});