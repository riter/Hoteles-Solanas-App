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

Solana.Collections.Galerias = Backbone.Collection.extend({
    url: api_host + '/listarGalerias',
    model: Solana.Models.Galery,
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
            _.each(response.datos,function(galerias){
                var model = new Solana.Models.Galery();
                model.set(galerias.Galeria);
                this.add(model);
            },this);
        }
        return this.models;
    }
});

Solana.Collections.Favorites = Backbone.Collection.extend({
    model: Solana.Models.DAS
});

/* nuevos */
Solana.Collections.Menus = Backbone.Collection.extend({
    url: api_host + '/listarMenus',
    model: Solana.Models.Menu,
    loading:false,

    initialize:function(){
    },
    loadMore : function(callback){
        var self = this;
        if(!this.loading){
            this.loading = true;
            this.fetch({data: {},
                success: function(model, response, options){
                    self.loading = false;

                    if(typeof callback == 'function')
                        callback();
                },error:function(){
                    self.loading = false;
                    self.loadJSON();
                }
            });
        }
    },
    loadJSON:function(){
        if(getStorage(this.url,null)){
            this.reset();
            this.set(getStorage(this.url,null));
        }
    }
});

Solana.Collections.Avisos = Backbone.Collection.extend({
    url: api_host + '/listarAvisosNotificados',
    model: Solana.Models.Aviso,
    loading:false,

    loadMore : function(callback){
        var self = this;
        if(!this.loading){
            this.loading = true;
            this.fetch({data: {udid:'APA91bE4iywO53LMFL2UGMG08wrKXPj402Y-ieLbZfvEuz9y2ZZr4sFclXhuZsfZ-5nOP_U9E-8G9jc6R-2q8TWr0ejhdi0dFpE8HLPFJ0X8V93JcJgspTi66lmtYmNGwM4qq-Kghm90'},
                success: function(model, response, options){
                    self.loading = false;

                    if(typeof callback == 'function')
                        callback();
                },error:function(){
                    self.loading = false;
                    self.loadJSON();
                }
            });
        }
    },
    loadJSON:function(){
        if(getStorage(this.url,null)){
            this.reset();
            this.set(getStorage(this.url,null));
        }
    }
});