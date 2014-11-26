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

        if(model.get('tipo') == 'principal_1'){
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
            if(this.model.get('nombre') == 'Cronograma D.A.S'){
                app.navigate('#tipo_das/'+this.model.get('id')+'/menu/'+this.model.get('nombre'),{trigger:true});
                return;
            }
            if(this.model.get('hijo')){
                app.navigate('#'+this.model.get('hijo').tipo+'/'+this.model.get('id')+'/menu/'+this.model.get('nombre'),{trigger:true});
            }
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
    },
    loadBanner:function(){
        var self = this;
        if(window.models.banner == null){
            window.models.banner = new Solana.Models.Banner();

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                if(getStorage(window.models.banner.url)){
                    var uri = fileSystem.root.toURL() + '/banner.png';
                    self.$el.find('.banner_home').css('background-image','url('+ uri +'?time='+(new Date()).getTime() +')');
                    setStorage('urlBanner',uri);
                }
                self.load();
            });
        }else{
            this.$el.find('.banner_home').css('background-image','url('+ getStorage('urlBanner',null)+'?time='+(new Date()).getTime() +')');
        }
    },
    load:function(){
        var self = this;
        window.models.banner.load(function(){
            if(getStorage(window.models.banner.url,null) &&
                JSON.stringify(getStorage(window.models.banner.url,null)) == JSON.stringify(window.models.banner.toJSON())){
                return;
            }
            dowloadImage(window.models.banner.get('urlBanner'),'banner.png',function(uri){
                setStorage(window.models.banner.url,window.models.banner.toJSON());
                setStorage('urlBanner',uri);
                self.$el.find('.banner_home').css('background-image','url('+ uri+'?time='+(new Date()).getTime() +')');
            });
        });
    }
});

Solana.Views.Categorias = Backbone.View.extend({
    template: _.template($('#listSecundario').html()),
    collection:null,
    model: Solana.Models.Datos,

    initialize:function(options){
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
        newCollection.url = this.collection.url;

        newCollection.loadMore(function(){
            if(getStorage(newCollection.url,null) &&
                JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.toJSON())){
                return;
            }
            setStorage(newCollection.url,newCollection.toJSON());
            self.parseJSON();
        });
    },
    newSecundario:function(model){
        var view = new Solana.Views.Secundario({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
    },
    newGaleria:function(model){
        var view = new Solana.Views.Galeria({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
    },
    newSubGaleria:function(model){
        var view = new Solana.Views.SubGaleria({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
    },
    newVideo:function(model){
        var view = new Solana.Views.Video({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
    },
    newAviso:function(model){
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
    Solana.Views.Secundario = Backbone.View.extend({
        template: _.template($('#secundario').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap >div':'item'
        },
        item:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            if(this.model.get('hijo')){
                app.navigate('#'+this.model.get('hijo').tipo+'/'+this.model.get('id')+'/categoria/'+this.model.get('nombre'),{trigger:true});
            }
        }
    });
    Solana.Views.Galeria = Backbone.View.extend({
        template: _.template($('#galeria').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap > div':'item'
        },
        item:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            if(this.model.get('hijo')){
                app.navigate('#'+this.model.get('hijo').tipo+'/'+this.model.get('id')+'/categoria/'+this.model.get('nombre'),{trigger:true});
            }
        }
    });
    Solana.Views.SubGaleria = Backbone.View.extend({
        template: _.template($('#subgaleria').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            //'tap > div':'item'
        },
        item:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            if(this.model.get('hijo')){
                app.navigate('#'+this.model.get('hijo').tipo+'/'+this.model.get('id')+'/categoria/'+this.model.get('nombre'),{trigger:true});
            }
        }
    });
    Solana.Views.Video = Backbone.View.extend({
        template: _.template($('#video').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            //'tap .txt-item':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
        }
    });
    Solana.Views.Aviso = Backbone.View.extend({
        template: _.template($('#aviso').html()),
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
        newCollection.clear();
        newCollection.url = this.model.url;

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
            var reserva = new Solana.Views.Reserva({tipo:'Me Interesa',titulo:'Ejemplo Titulo'});
            $('body').append(reserva.render().el);
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
            var reserva = new Solana.Views.Reserva({tipo:'Reserva',titulo:'Ejemplo Titulo'});
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
    model: Solana.Models.Mobile,
    initialize:function(options){
        this.model = new Solana.Models.Mobile(options);
    },
    render:function () {
        this.setElement(this.template({mobile:window.models.mobile}));
        return this;
    },
    events:{
        'tap .btn-reserva':'reserva',
        'tap .btn-cancelar':'cancelar'
    },
    reserva:function(ev){
        var self = this;

        var tipo = this.model.get('tipo');
        var titulo = this.model.get('titulo');
        var nombre = this.$el.find('input[name=nombre]').val();
        var email = this.$el.find('input[name=email]').val();
        var celular = this.$el.find('input[name=celular]').val();
        self.model.set({nombre:nombre, email:email, celular:celular});

        self.model.sendReservaInteresa(function(success){
            if(success){
                window.models.mobile.set(self.model.toJSON());
                setStorage('mobile',window.models.mobile.toJSON());
                self.cancelar(ev);
            }else
                alert('Ha ocurrido un Error vuelva a intentarlo');
        });
    },
    cancelar:function(ev){
        var self = this;
        self.$el.fadeOut('250',function(){
            self.$el.remove()
        });
    }
});

/*  prueba de DAS*/
Solana.Views.CronogramaDas = Backbone.View.extend({
    template: _.template($('#cronograma_das').html()),
    model:null,
    slider:null,

    initialize:function(options){
        this.model = new Solana.Models.Datos(options);
    },
    render:function () {
        $(this.el).html(this.template());
        window.views.menu.model.set(this.model.toJSON());
        this.$el.prepend(window.views.menu.render().el);

        this.model.unset('title');
        this.model.unset('type');
        return this;
    },
    events:{
        'tap div.por_dia':'por_dia',
        'tap div.favoritos':'favoritos'
    },
    newFavorite:function(model){
        var $favorite = this.$el.find('.favorite > ul');
        $favorite.empty();

        var order = window.collections.favoritos.ordenar();
        var groupOrder = new Solana.Collections.DAS(order).agrupar();
        for (var i = 0; i < Object.keys(groupOrder).length; i++) {
            var $tmp =  $(_.template($('#item_favorite').html(),{fecha:new Date(Object.keys(groupOrder)[i]).getTime()}));
            $favorite.append($tmp);

            var grupo = groupOrder[Object.keys(groupOrder)[i]];
            for (var c = 0; c < grupo.length; c++) {
                var view = new Solana.Views.Favorite({model:grupo[c]});
                view.view_parent = this;
                $tmp.find('.list2').append(view.render().el);
            }
        }
        setStorage('favorites',window.collections.favoritos.toJSON());
    },
    loadPorDiaLeft:function(fecha){
        var dia = new Solana.Views.ItemSlider({fecha:fecha});
        dia.view_parent = this;
        dia.collection = new Solana.Collections.DAS({ /* parametros para fin collection */});
        dia.collection.on('add',dia.newPorDia,dia);

        this.$el.find('.bxslider').prepend(dia.render().el);
        dia.loadMoreView();
    },
    loadPorDiaRight:function(fecha){
        var dia = new Solana.Views.ItemSlider({fecha:fecha});
        dia.view_parent = this;
        dia.collection = new Solana.Collections.DAS({ /* parametros para fin collection */});
        dia.collection.on('add',dia.newPorDia,dia);

        this.$el.find('.bxslider').append(dia.render().el);
        dia.loadMoreView();
    },
    por_dia:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').addClass('active');
        ev.target.classList.add("active");

        this.el.querySelector('.content_por_dia').style.display = 'block';
        this.el.querySelector('.favorite').style.display = 'none';
    },
    favoritos:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').removeClass('active');
        ev.target.classList.add("active");

        this.el.querySelector('.favorite').style.display = 'block';
        this.el.querySelector('.content_por_dia').style.display = 'none';
    },

    showSlider:function(index){
        var options = {
            controls: false,
            pager:false,
            infiniteLoop:false,
            touchEnabled:false,
            startSlide : index != null ? index:0
        };

        if(this.slider == null){
            this.slider = this.$el.find('ul.bxslider').bxSlider(options);
        }else{
            options['startSlide'] = this.slider.getCurrentSlide();
            this.slider.reloadSlider(options);
        }
    },
    backSlider:function(fecha){
        var current =  this.slider.getCurrentSlide();
        if(current == 0){
            this.loadPorDiaLeft(DayAnterior(fecha));
            this.showSlider(1);
        }
        this.slider.goToPrevSlide();
    },
    nextSlider:function(fecha){
        var current =  this.slider.getCurrentSlide();
        if(current + 1  == this.slider.getSlideCount()){
            this.loadPorDiaRight(DaySiguiente(fecha));
            this.showSlider(current);
        }
        this.slider.goToNextSlide();
    }
});
    Solana.Views.ItemSlider = Backbone.View.extend({
        template: _.template($('#item_slider').html()),
        collection:Solana.Collections.DAS,
        view_parent: null,
        model:Solana.Models.Datos,

        initialize:function(options){
            this.model = new Solana.Models.Datos(options);
        },
        render:function () {
            this.setElement(this.template(this.model.toJSON()));

            this.parseJSON();
            return this;
        },
        events:{
            'tap div.slider_left':'backSlider',
            'tap div.slider_right':'nextSlider'
        },
        loadMoreView:function(){
            var self = this;

            var newCollection = this.collection.clone();
            newCollection.reset();
            newCollection.url = this.collection.url;

            newCollection.loadMore(function(){
                if(getStorage(newCollection.url,null) &&
                    JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.toJSON())){
                    return;
                }
                setStorage(newCollection.url,newCollection.toJSON());
                self.parseJSON();
                self.view_parent.showSlider();
            });
        },
        parseJSON:function(){
            this.$el.find('.list2').empty();
            this.collection.loadJSON();
        },
        newPorDia:function(model){
            var view = new Solana.Views.Favorite({model:model});
            view.view_parent = this;
            this.$el.find('.list2').append(view.render().el);
        },
        backSlider:function(ev){
            this.view_parent.backSlider(this.model.get('fecha'));
        },
        nextSlider:function(ev){
            this.view_parent.nextSlider(this.model.get('fecha'));
        }
    });
    Solana.Views.Favorite = Backbone.View.extend({
        template: _.template($('#favorite').html()),
        view_parent: null,

        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'touchstart .favorite-item':'favorite'
        },
        favorite:function(ev){
            var id = this.model.get('id');
            if(this.$el.parents('.favorite').length>0){
                window.collections.favoritos.remove(this.model);
                $('.bxslider ul li[data-id='+id+'] span.favorite-item').removeClass('active');
            }else{
                if($(ev.target).hasClass('active')){
                    window.collections.favoritos.remove(this.model);
                }else{
                    window.collections.favoritos.add(this.model);
                }
            }
            $(ev.target).toggleClass('active');
        }
    });