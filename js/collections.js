/**
 * Created by Riter on 20/10/14.
 */

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

Solana.Collections.DAS = Backbone.Collection.extend({
    model: Solana.Models.DAS,
    loading:false,
    previous:'',
    next:'',

    initialize:function(options){
        this.url = api_host + '/listarCategoria';
        if(options)
            this.url = this.url + '?id=' + options.id + '&tabla=' + options.tabla  + '&fecha=' + options.fecha;
    },
    ordenar:function(){
        return this.sortBy(function(model) {
            return model.get('fecha').toDate().getTime();
        })
    },
    agrupar:function(){
        return this.groupBy( function(model){
            return model.get('fecha').toDate().yyyymmdd();
        });
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
    JSON:function(){
      return {models:this.toJSON(),previous:this.previous,next:this.next};
    },
    loadJSON:function(){
        if(getStorage(this.url,null)){
            this.reset();
            var json = getStorage(this.url,null);
            this.set(json.models);
            this.previous = json.previous;
            this.next = json.next;
        }
    },
    parse:function(response){
        var separatorLocal = new Date().toLocaleDateString().indexOf('/')>-1?'/':'-';

        this.previous = response['Paginate']['previous'] ? response['Paginate']['previous'].replace(/-/gi,separatorLocal):null;
        this.next = response['Paginate']['next'] ? response['Paginate']['next'].replace(/-/gi,separatorLocal):null;

        return response['Datos'];
    }
});