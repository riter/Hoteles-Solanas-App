/**
 * Created by Riter on 20/10/14.
 */

Solana.Models.ItemList = Backbone.Model.extend({
    initialize: function () {
    }
});
    /* Solana.Models.Type1 = Backbone.Model.extend({
        initialize: function () {
        }
    }); */

    Solana.Models.Type3 = Backbone.Model.extend({
        initialize: function () {
        },
        load:function(callback){
            this.fetch({data: $.param(this.attributes),
                success: function(model, response, options){
                    if(typeof callback == 'function')
                        callback();
                },error:function(){
                    alert('Error');
                }
            });
        },
        parse:function(response){

            if(response.datos.length > 0){
                var modelo = response.datos[_.keys(response.datos)[0]];
                this.set(modelo[_.keys(modelo)[0]]);
            }
        }
    });

Solana.Models.DAS = Backbone.Model.extend({
    defaults:{
        nombre:'Nombre Actividad',
        'tipo':'Tipo de Actividad',
        'lugar':'Lugar de Actividad',
        'horario':'8:30',
        'fecha':'07/11/2014'
    }
});

Solana.Models.Videos = Backbone.Model.extend({
    initialize: function () {
    }
});

Solana.Models.Galery = Backbone.Model.extend({
    initialize: function () {
    }
});

/* nuevos*/
Backbone.Model.prototype.serialize = function() {
    var str = [], obj = this.attributes;
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return this.url + '?' + str.join("&");
};

//_.extend(Backbone.Model, Backbone.Events);

Solana.Models.Datos = Backbone.Model.extend({});

Solana.Models.Menu= Backbone.Model.extend({
    parse:function(response){
        this.set(response[_.keys(response)[0]]);
    }
});

Solana.Models.Aviso= Backbone.Model.extend({
    parse:function(response){
        this.set(response[_.keys(response)[0]]);
    }
});

Solana.Models.Pagina = Backbone.Model.extend({
    initialize:function(){
        this.url = api_host + '/listarPagina?id=' + this.get('id');
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