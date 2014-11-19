/**
 * Created by Riter on 20/10/14.
 */
var heightHeader = 42;

Solana.Views.Menu = Backbone.View.extend({
    template: _.template($('#menu').html()),
    collection:Solana.Collections.Menus,
    model: Solana.Models.Menu,

    initialize:function(options){
        this.model = new Solana.Models.Menu();
        typeof(options) !== 'undefined'? this.model.set(options) : '';

        this.collection = new Solana.Collections.Menus();
        this.collection.on('add',this.newModel,this);
    },
    render:function () {
        console.log(this.model.toJSON());
        this.setElement(this.template(this.model.toJSON()));
        if( this.model.get('type') != 'back'){
            this.el.querySelector('ul.menu-izq').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
            this.el.querySelector('.fondo-menu').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
            this.parseJSON();
        }
        return this;
    },
    events:{
        'tap div.icon-izq':'toggleMenuIzq',
        'tap div.ave':'logo',
        'tap div.icon-der':'toggleMenuDer',
        'tap h1.logo':'hideMenu',
        'tap .fondo-menu':'hideMenu',
        'touchmove .fondo-menu':'touch',
        'click div.back': 'back'
    },
    loadMoreView:function(){
        var self = this;

        var newCollection = new Solana.Collections.Menus();
        newCollection.loadMore(function(){
            if(getStorage(newCollection.url,null) &&
                JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.toJSON())){
                return;
            }
            setStorage(newCollection.url,newCollection.toJSON());
            self.parseJSON();
        });
    },
    newModel:function(model){
        var view = new Solana.Views.ItemMenu({model:model});

        if(model.get('tipo') == 'principal1'){
            this.el.querySelector('ul.menu-izq').appendChild(view.render().el) ;
        }else{
            this.el.querySelector('ul.menu-der').appendChild(view.render().el) ;
        }
    },
    parseJSON:function(){
        this.$el.find('ul.menu-izq,ul.menu-der').empty();
        this.collection.loadJSON();
    },
    touch:function(ev){
        ev.preventDefault();
    },
    logo:function(){
        app.navigate('#home/fade',{trigger:true});
    },
    hideMenu:function(ev){
        this.$el.find('.menu-izq, .menu-der, .fondo-menu').hide();
    },
    toggleMenuIzq:function(ev){
        this.el.querySelector('.menu-der').style.display = 'none';

        var element = this.el.querySelector('.menu-izq');
        element.style.display = element.style.display == 'block'?'':'block';
        this.el.querySelector('.fondo-menu').style.display = element.style.display;
    },
    toggleMenuDer:function(ev){
        this.el.querySelector('.menu-izq').style.display = 'none';

        var element = this.el.querySelector('.menu-der');
        element.style.display = element.style.display == 'block'?'':'block';
        this.el.querySelector('.fondo-menu').style.display = element.style.display;
    },
    back:function(ev){
        app.navigate('#'+app.popHistory()+'/reverse',{trigger:true});
    }
});
    Solana.Views.ItemMenu = Backbone.View.extend({
        template: _.template($('#item_menu').html()),
        model:Solana.Models.Menu,

        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap a':'submenu'
        },
        submenu:function(ev){
            ev.preventDefault();
            app.navigate('#pagina4',{trigger:true});
        }
    });

Solana.Views.Index = Backbone.View.extend({
    template: _.template($('#index').html()),

    render:function () {
        $(this.el).html(this.template());
        window.views.menu.model.clear();
        this.$el.prepend(window.views.menu.render().el);

        var banner = $(window).height() * 0.6150;
        this.el.querySelector('.banner_home').style.height = banner + 'px';
        this.el.querySelector('.img_home').style.height = ($(window).height() - banner - heightHeader - 3) + 'px';

        return this;
    }
});

Solana.Views.Categorias = Backbone.View.extend({
    template: _.template($('#listSecundario').html()),

    collection:null,
    model: Solana.Models.Datos,

    initialize:function(options){
        _.bindAll(this, 'render');
        this.model = new Solana.Models.Datos(options);
    },
    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        window.views.menu.model.set(this.model.toJSON());
        this.$el.prepend(window.views.menu.render().el);

        var $list = this.el.querySelectorAll('.content, .list');
        $list[0].style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        $list[1].style.minHeight = ($list[0].style.maxHeight.replace('px','') - this.$el.find('.footer').getSize().height) + 'px';

        this.parseJSON();
        return this;
    },
    loadMoreView:function(){
        var self = this;

        var newCollection = this.collection.clone();
        newCollection.reset();

        newCollection.loadMore(function(){
            if(getStorage(newCollection.url,null) &&
                JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.toJSON())){
                return;
            }
            setStorage(newCollection.url,newCollection.toJSON());
            self.parseJSON();
        });
    },
    newModelAviso:function(model){
        var view = new Solana.Views.Aviso({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
    },
    parseJSON:function(){
        this.$el.find('ul.list').empty();
        this.collection.loadJSON();
    },
    events:{
    }
});
    Solana.Views.Aviso = Backbone.View.extend({
        template: _.template($('#aviso').html()),
        model:Solana.Models.Menu,
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .txt-item':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
        }
    });

Solana.Views.Pagina = Backbone.View.extend({
    template: _.template($('#pagina').html()),
    model: null,

    initialize:function(){
    },
    render:function () {
        $(this.el).html(this.template());
        window.views.menu.model.set(this.model.toJSON());
        this.$el.prepend(window.views.menu.render().el);

        var $list = this.el.querySelectorAll('.content, .content-pagina');
        $list[0].style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        $list[1].style.minHeight = ($list[0].style.maxHeight.replace('px','') - this.$el.find('.footer').getSize().height) + 'px';

        this.model.unset('title');
        this.model.unset('type');
        this.parseJSON();
        return this;
    },
    loadView:function(){
        var self = this;

        var newCollection = this.model.clone();
        newCollection.load(function(){
            if(getStorage(newCollection.url,null) &&
                JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.toJSON())){
                return;
            }
            setStorage(newCollection.url,newCollection.toJSON());
            self.parseJSON();
        });
    },
    newPagina1:function(){
        var view = new Solana.Views.Pagina1({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    newPagina2:function(){
        var view = new Solana.Views.Pagina2({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    newPagina3:function(){
        var view = new Solana.Views.Pagina3({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    newPagina4:function(){
        var view = new Solana.Views.Pagina4({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    newPromo:function(){
        var view = new Solana.Views.Promo({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    parseJSON:function(){
        this.$el.find('div.content-pagina').empty();
        this.model.loadJSON();
    }
});
    Solana.Views.Pagina1 = Backbone.View.extend({
        template: _.template($('#type1').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .txt-item':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
        }
    });
    Solana.Views.Pagina2 = Backbone.View.extend({
        template: _.template($('#type2').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .title_horario':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
        }
    });
    Solana.Views.Pagina3 = Backbone.View.extend({
        template: _.template($('#type3').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .btn-interesa':'interesa'
        },
        interesa:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
        }
    });
    Solana.Views.Pagina4 = Backbone.View.extend({
        template: _.template($('#type4').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .btn-reserva':'reserva'
        },
        reserva:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            var reserva = new Solana.Views.Reserva();
            $('body').append(reserva.render().el);
        }
    });
    Solana.Views.Promo = Backbone.View.extend({
        template: _.template($('#promo').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
        }
    });
Solana.Views.Reserva = Backbone.View.extend({
    template: _.template($('#reserva').html()),
    render:function () {
        this.setElement(this.template());
        return this;
    },
    events:{
        'tap .btn-reserva':'cancelar',
        'tap .btn-cancelar':'cancelar'
    },
    cancelar:function(){
        var self = this;
        self.$el.fadeOut('250',function(){
            self.$el.remove()
        });
    }
});