/**
 * Created by Riter on 20/10/14.
 */

Backbone.Model.prototype.serialize = function() {
    var str = [], obj = this.attributes;
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return this.url + '?' + str.join("&");
};

Solana.Models.DAS = Backbone.Model.extend({
    defaults:{
        nombre:'Nombre Actividad',
        tipo:'Tipo de Actividad',
        lugar:'Lugar de Actividad',
        horario:'8:30'
    },
    parse:function(response){
        this.set(response.Menu);
    }
});

Solana.Models.Mobile = Backbone.Model.extend({
    url:api_host + '/registrarMobile',
    load:function(callback){
        this.set('modified', getDateTime());

        this.fetch({data: this.attributes,
            type:'POST',
            success: function(model, response, options){
                if(typeof callback == 'function')
                    callback();
            },error:function(){
            }
        });
    },
    sendReservaInteresa:function(callback){
        this.url = api_host + '/enviarEmailReservaInteresa';
        this.fetch({data: this.attributes,
            type:'POST',
            success: function(model, response, options){
                var res = response.message != ''? true : null;
                if(typeof callback == 'function')
                    callback(res);
            },error:function(){
                if(typeof callback == 'function')
                    callback(null);
            }
        });
    },
    parseJSON:function(){
        if(getStorage('mobile',null)){
            this.set(getStorage('mobile',null));
        }
    },
    parse:function(response){
    }
});

Solana.Models.Datos = Backbone.Model.extend({});

Solana.Models.Menu= Backbone.Model.extend({
    parse:function(response){
        if(Object.keys(response.Categorias).length > 0){
            this.set('hijo',response.Categorias[0])
        }else{
            if(Object.keys(response.Pagina).length > 0)
                this.set('hijo',response.Pagina[0]);
        }
        this.set(response.Menu);
    }
});

Solana.Models.Categoria= Backbone.Model.extend({
    parse:function(response){
        if(Object.keys(response.Categorias).length > 0){
            this.set('hijo',response.Categorias[0])
        }else{
            if(Object.keys(response.Pagina).length > 0)
                this.set('hijo',response.Pagina[0]);
        }
        this.set(response.Categoria);
    }
});

Solana.Models.Pagina = Backbone.Model.extend({
    initialize:function(){
        this.url = api_host + '/listarPagina?id=' + this.get('id') + '&tabla=' + this.get('tabla');
    },
    load:function(callback){

        this.fetch({data: {},
            success: function(model, response, options){
                if(typeof callback == 'function')
                    callback();
            },error:function(){
            }
        });
    },
    parse:function(response){
        this.set(response[_.keys(response)[0]]);
    },
    loadJSON:function(){
        if(getStorage(this.url,null)){
            this.set(getStorage(this.url,null));
            this.trigger("clear", this);
        }
    }
});

Solana.Models.Aviso= Backbone.Model.extend({
    parse:function(response){
        this.set(response[_.keys(response)[0]]);
    }
});

Solana.Models.Banner = Backbone.Model.extend({
    initialize:function(){
        this.url = api_host + '/bannerInicio';
    },
    load:function(callback){
        this.fetch({data: {},
            success: function(model, response, options){
                if(typeof callback == 'function')
                    callback();
            },error:function(){
            }
        });
    },
    parse:function(response){
        var model = response[_.keys(response)[0]];
        this.set('id',model.id);
        this.set('urlBanner',model[model.banner]);
    },
    loadJSON:function(){
        if(getStorage(this.url,null)){
            this.set(getStorage(this.url,null));
        }
    }
});