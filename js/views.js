/**
 * Created by Riter on 20/10/14.
 */
var heightHeader = 42;

Solana.Views.Menu = Backbone.View.extend({
    template: _.template($('#menu').html()),
    model: Solana.Models.Menu,

    initialize:function(options){
        this.model = new Solana.Models.Menu();
        typeof(options) !== 'undefined'? this.model.set(options) : '';
    },
    render:function () {
        this.setElement(this.template(this.model.toJSON()));
        if( this.model.get('type') != 'back'){
            this.el.querySelector('ul.menu-izq').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
            this.el.querySelector('.fondo-menu').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
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

Solana.Views.Index = Backbone.View.extend({
    template: _.template($('#index').html()),
    menu:Solana.Views.Menu,

    initialize:function(){
        this.menu = new Solana.Views.Menu()
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);

        var banner = $(window).height() * 0.6150;
        this.el.querySelector('.banner_home').style.height = banner + 'px';
        this.el.querySelector('.img_home').style.height = ($(window).height() - banner - heightHeader - 3) + 'px';

        return this;
    }
});

Solana.Views.ViewList = Backbone.View.extend({
    template: _.template($('#view_list').html()),
    menu:Solana.Views.Menu,
    collection:Solana.Collections.ItemLists,

    initialize:function(options){
        this.menu = new Solana.Views.Menu(options);
        this.collection = new Solana.Collections.ItemLists();
        this.collection.on('add',this.newModel,this);
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);

        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        return this;
    },
    loadMoreView:function(){
        var self = this;
        this.collection.loadMore(function(){
            setStorage(app.lastHistoy(),self.toJSON());
        });
    },
    newModel:function(model){
        if(typeof(this.menu.model.get('item_type')) !== 'undefined' && this.menu.model.get('item_type') != ''){
            model.set('item_type',this.menu.model.get('item_type'));
        }
        var view = new Solana.Views.ItemList({model:model});
        view.render();
    },
    toJSON:function(){
        return {collection:this.collection.toJSON(), page:this.collection.attr('page')};
    },
    parseJSON:function(json){
        this.collection.attr('page',json.page);
        this.collection.set(json.collection);
    }
});

    Solana.Views.ItemList = Backbone.View.extend({
        template: _.template($('#item_list').html()),
        model: Solana.Models.ItemList,

        initialize:function(){
        },
        render:function () {
            $(this.el).html(this.template(this.model.toJSON()));
            document.querySelector('ul.list').appendChild(this.el);
        },
        events:{
            'tap li.item': 'view_item'
        },
        view_item:function(ev){
            this.model.set('title',this.model.get('titulo'));
            setStorage('item_type'+this.model.get('item_type')+'/'+this.model.get('id'),this.model.toJSON());
            app.navigate('#item_type'+this.model.get('item_type')+'/'+ this.model.get('id'),{trigger:true});
        }
    });

        Solana.Views.Type1 = Backbone.View.extend({
            template: _.template($('#type1_list_view').html()),
            menu:Solana.Views.Menu,
            model: Solana.Models.Type1,

            initialize:function(options){
                options['type'] = 'back';
                this.menu = new Solana.Views.Menu(options);
                this.model = new Solana.Models.Type1(options);
            },
            render:function () {
                $(this.el).html(this.template(this.model.toJSON()));
                this.$el.prepend(this.menu.render().el);

                this.el.querySelector('.image').style.height = ($(window).height() * 0.3392) + 'px';
                return this;
            }
        });

        Solana.Views.Type3 = Backbone.View.extend({
            template: _.template($('#type3_list_view').html()),
            model: Solana.Models.Type3,

            initialize:function(data){
                this.model = new Solana.Models.Type3(data);
            },
            loadModel:function(view){
                var self = this;

                this.model.set({page:-1,limit:-1});
                this.model.load(function(){
                    self.render(view);
                });
            },
            render:function (view) {
                $(this.el).html(this.template(this.model.toJSON()));
                this.el.querySelector('.content-type3').style.maxHeight = ($(window).height() - heightHeader - 67 - 6) + 'px';

                if(typeof (view) !== 'undefined'){
                    view.$el.find('.content').replaceWith(this.el);
                    view.$el.trigger('pagecreate');
                }
                return this;
            }
        });

/* Start Videos*/
Solana.Views.Videos = Backbone.View.extend({
    template: _.template($('#videos').html()),
    menu:Solana.Views.Menu,
    collection:Solana.Collections.Videos,

    initialize:function(){
        this.menu = new Solana.Views.Menu({title:'Videos'});
        this.collection = new Solana.Collections.Videos();

        this.collection.on('add',this.newModel,this);
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);
        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader - 8) + 'px';
        return this;
    },
    newModel:function(model){
        var view = new Solana.Views.VideoList({model:model});
        view.render();
    }
});
    Solana.Views.VideoList = Backbone.View.extend({
        template: _.template($('#video_list').html()),
        model: Solana.Models.Videos,

        render:function () {
            $(this.el).html(this.template(this.model.toJSON()));
            document.querySelector('ul.list').appendChild(this.el);
            return this;
        }
    });
/* End Videos*/

Solana.Views.CronogramaDas = Backbone.View.extend({
    template: _.template($('#cronograma_das').html()),
    menu:Solana.Views.Menu,
    slider:null,

    initialize:function(){
        this.menu = new Solana.Views.Menu({title:'Cronograma DAS'})
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);
        return this;
    },
    events:{
        'tap div.slider_left':'backSlider',
        'tap div.slider_right':'nextSlider',

        'tap div.por_dia':'por_dia',
        'tap div.favoritos':'favoritos'
    },
    por_dia:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').addClass('active');
        ev.target.classList.add("active");

        this.el.querySelector('.content_por_dia').style.display = 'block';
        this.el.querySelector('.favorite').style.display = 'none';

        this.showSlider(ev);
    },
    favoritos:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').removeClass('active');
        ev.target.classList.add("active");

        this.el.querySelector('.favorite').style.display = 'block';
        this.el.querySelector('.content_por_dia').style.display = 'none';
    },
    showSlider:function(ev){
        if(this.slider == null){
            this.slider = this.$el.find('ul.bxslider').bxSlider({
                controls: false,
                pager:false,
                infiniteLoop:false,
                touchEnabled:false
            });
        }
    },
    backSlider:function(){
        this.slider.goToPrevSlide();
    },
    nextSlider:function(){
        this.slider.goToNextSlide();
    }
});

Solana.Views.Galerias = Backbone.View.extend({
    template: _.template($('#galerias').html()),
    menu: Solana.Views.Menu,
    collection: Solana.Collections.Galerias,

    initialize:function(options){
        this.menu = new Solana.Views.Menu(options);

        this.collection = new Solana.Collections.Galerias();
        this.collection.on('add',this.newModel,this);
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);

        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        return this;
    },
    loadMoreView:function(){
        var self = this;
        this.collection.loadMore(function(){
            setStorage(app.lastHistoy(),self.toJSON());
        });
    },
    newModel:function(model){
        var view = new Solana.Views.ItemGalery({model:model});
        view.render();
    },
    toJSON:function(){
        return {collection:this.collection.toJSON(), page:this.collection.attr('page')};
    },
    parseJSON:function(json){
        this.collection.attr('page',json.page);
        this.collection.set(json.collection);
    }
});
    Solana.Views.ItemGalery = Backbone.View.extend({
        template: _.template($('#item_galery').html()),
        model: Solana.Models.Galery,

        render:function () {
            $(this.el).html(this.template(this.model.toJSON()));
            document.querySelector('.content-galerias ul.list').appendChild(this.el)
        },
        events:{
            'tap li.galerias-item': 'item_gallery'
        },
        item_gallery:function(ev){
            this.model.set('title',this.model.get('titulo'));
            setStorage('list_image/'+this.model.get('id'),this.model.toJSON());
            app.navigate('#list_image/'+ this.model.get('id'),{trigger:true});
        }
    });
    Solana.Views.GaleryImages = Backbone.View.extend({
        template: _.template($('#item_galerias').html()),
        menu:Solana.Views.Menu,
        model: Solana.Models.Galery,

        initialize:function(options){
            options['type'] = 'back';
            this.menu = new Solana.Views.Menu(options);
            this.model = new Solana.Models.Type1(options);
        },
        render:function () {
            $(this.el).html(this.template(this.model.toJSON()));
            this.$el.prepend(this.menu.render().el);

            this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
            return this;
        }
    });

Solana.Views.DatosUtiles = Backbone.View.extend({
    template: _.template($('#datos_utiles').html()),
    menu:Solana.Views.Menu,

    initialize:function(){
        this.menu = new Solana.Views.Menu({title:'Datos útiles'})
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);

        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        return this;
    },
    events:{
        'tap ul.list li.item': 'view_item'
    },
    view_item:function(ev){
        ev.preventDefault();
    }
});

Solana.Views.Avisos = Backbone.View.extend({
    template: _.template($('#avisos').html()),
    menu:Solana.Views.Menu,

    initialize:function(){
        this.menu = new Solana.Views.Menu({title:'Avisos'})
    },
    render:function () {
        $(this.el).html(this.template());
        this.$el.prepend(this.menu.render().el);

        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - heightHeader) + 'px';
        return this;
    },
    events:{
        'tap ul.list li.item': 'view_item'
    },
    view_item:function(ev){
        ev.preventDefault();
    }
});