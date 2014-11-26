/**
 * Created by Riter on 20/10/14.
 */

Solana.Collections.DAS = Backbone.Collection.extend({
    url: api_host + '/listarMenus?id=1',
    model: Solana.Models.DAS,
    loading:false,

    ordenar:function(){
        return this.sortBy(function(m) { return new Date(m.get('fecha')).getTime() })
    },
    agrupar:function(){
        return this.groupBy( function(model){ return new Date(model.get('fecha')).yyyymmdd() });
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

Solana.Collections.Categoria = Backbone.Collection.extend({
    model: Solana.Models.Categoria,
    loading:false,

    initialize:function(options){
        this.url = api_host + '/listarCategoria?id=' + options.id + '&tabla=' + options.tabla;
    },
    loadMore : function(callback){
        var self = this;
        if(!this.loading){
            this.loading = true;
            this.fetch({
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

Solana.Collections.Aviso = Backbone.Collection.extend({
    url: api_host + '/listarAvisosNotificados',
    model: Solana.Models.Aviso,
    loading:false,

    loadMore : function(callback){
        var self = this;
        if(!this.loading){
            this.loading = true;
            this.fetch({data: { udid:  pushNotification.getDeviceToken()},
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