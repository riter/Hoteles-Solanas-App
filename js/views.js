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
        'touchstart div.icon-izq':'toggleMenuIzq',
        'touchstart div.ave':'logo',
        'touchstart div.icon-der':'toggleMenuDer',
        'touchstart h1.logo':'hideMenu',
        'touchstart h1.title_header':'back',
        'touchstart .fondo-menu':'hideMenu',
        'touchmove .fondo-menu':'touch',
        'touchstart div.back': 'back'
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
        /* elimina el scroll*/
    },
    logo:function(){
        app.navigate('#home/fade',{trigger:true});
    },
    hideMenu:function(ev){
        var ele = this.el.querySelectorAll('.fondo-menu, .menu-izq, .menu-der');
        $(ele).fadeOut('400');
    },
    toggleMenuIzq:function(ev){
        var ele = this.el.querySelectorAll('.fondo-menu, .menu-izq, .menu-der');

        if(ele[1].style.display == 'block'){
            $(ele).fadeOut('400');
        }else{
            $(ele[2]).fadeOut('400');
            $([ele[1],ele[0]]).fadeIn('400');
        }
    },
    toggleMenuDer:function(ev){
        var ele = this.el.querySelectorAll('.fondo-menu, .menu-izq, .menu-der');

        if(ele[2].style.display == 'block'){
            $(ele).fadeOut('400');
        }else{
            $(ele[1]).fadeOut('400');
            $([ele[2],ele[0]]).fadeIn('400');
        }
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
        this.el.querySelector('.banner_promo').style.height = banner + 'px';
        this.el.querySelector('.banner_home').style.height = ($(window).height() - banner - heightHeader - 3) + 'px';

        return this;
    },
    loadBanner:function(){
        var self = this;
        if(window.models.banner == null){
            window.models.banner = new Solana.Models.Banner();

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                if(getStorage(window.models.banner.url,null)){
                    var uriPromo = fileSystem.root.toURL() + '/images/promo.jpg';
                    var uriBanner = fileSystem.root.toURL() + '/images/banner.jpg';

                    self.$el.find('.loading').addClass('loading-notransition');
                    self.$el.find('.banner_promo').attr('data-url',uriPromo +'?time='+(new Date()).getTime());
                    self.$el.find('.banner_home').attr('data-url',uriBanner +'?time='+(new Date()).getTime());
                    backgroundLoading(self.el);
                    setStorage('urlPromo',uriPromo);
                    setStorage('urlBanner',uriBanner);
                }
                self.load();
            });
        }else{
            self.$el.find('.loading').addClass('loading-notransition');
            self.$el.find('.banner_promo').attr('data-url',getStorage('urlPromo',null));
            self.$el.find('.banner_home').attr('data-url',getStorage('urlBanner',null));
            backgroundLoading(self.el);
        }
    },
    load:function(){
        var self = this;
        window.models.banner.load(function(){
            if(getStorage(window.models.banner.url,null) &&
                JSON.stringify(getStorage(window.models.banner.url,null)) == JSON.stringify(window.models.banner.toJSON())){
                return;
            }

            dowloadImage(encodeURI(window.models.banner.get('Promo').urlPromo),'promo.jpg',function(uri){
                setStorage(window.models.banner.url,window.models.banner.toJSON());
                setStorage('urlPromo',uri);
                self.$el.find('.banner_promo').attr('data-url',uri +'?time='+(new Date()).getTime()).removeClass('loading-notransition');
                backgroundLoading(self.el);
            });

            dowloadImage(encodeURI(window.models.banner.get('Banner').urlBanner),'banner.jpg',function(uri){
                setStorage(window.models.banner.url,window.models.banner.toJSON());
                setStorage('urlBanner',uri);
                self.$el.find('.banner_home').attr('data-url',uri +'?time='+(new Date()).getTime()).removeClass('loading-notransition');
                backgroundLoading(self.el);
            });
        });
    }
});

Solana.Views.Categorias = Backbone.View.extend({
    template: _.template($('#listCategorias').html()),
    collection:null,
    model: Solana.Models.Datos,
    swiper:null,

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

        /*var $list = this.el.querySelectorAll('.swiper-container, .list');
        $list[0].style.height = (window.innerHeight - heightHeader) + 'px';
        $list[1].style.minHeight = ($list[0].style.height.replace('px','') - this.$el.find('.footer').getSize().height) + 'px';*/

        this.parseJSON();
        return this;
    },
    scrolling:function(){
        if(this.swiper == null){
            var self =this;
            setTimeout(function(){
                self.swiper = new Swiper(self.el.querySelector('.swiper-container'),{
                    scrollContainer: true,
                    mode: 'vertical',
                    scrollbar: {
                        container: '.swiper-scrollbar'
                    }
                });
            },500);
        }else{
            this.swiper.reInit();
        }
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
        backgroundLoading(view.el);
        //this.scrolling();
    },
    newGaleria:function(model){
        var view = new Solana.Views.Galeria({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
        backgroundLoading(view.el);
       //this.scrolling();
    },
    newVideo:function(model){
        var view = new Solana.Views.Video({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
        //this.scrolling();
    },
    newAviso:function(model){
        var view = new Solana.Views.Aviso({model:model});
        this.el.querySelector('ul.list').appendChild(view.render().el) ;
        backgroundLoading(view.el);
        //this.scrolling();
    },
    parseJSON:function(){
        this.$el.find('ul.list').empty();
        this.collection.loadJSON();
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
            if(this.model.get('urlexterna') && this.model.get('urlexterna') != ''){
                var open = window.open(this.model.get('urlexterna'), '_blank', 'closebuttoncaption=Cerrar,transitionstyle=crossdissolve,EnableViewPortScale=yes,location=yes,toolbar=yes');
            }else{
                if(this.model.get('hijo')){
                    app.navigate('#'+this.model.get('hijo').tipo+'/'+this.model.get('id')+'/categoria/'+this.model.get('nombre'),{trigger:true});
                }
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
    Solana.Views.Video = Backbone.View.extend({
        template: _.template($('#video').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap iframe':'iframe'
        },
        iframe:function(){
            alert();
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
            if(this.model.get('tipourl') == 'externa'){
                var open = window.open(this.model.get('urlinterna'), '_blank', 'closebuttoncaption=Cerrar,transitionstyle=crossdissolve,EnableViewPortScale=yes,location=yes,toolbar=yes');
            }else{
                var url = this.model.get('urlinterna').split('/');
                app.navigate('#'+url[2]+'/'+url[0]+'/'+ url[1] +'/'+url[3],{trigger:true});
            }
        }
    });

Solana.Views.Pagina = Backbone.View.extend({
    template: _.template($('#pagina').html()),
    model: null,
    swiper:null,

    initialize:function(){
    },
    render:function () {
        $(this.el).html(this.template());
        window.views.menu.model.set(this.model.toJSON());
        this.$el.prepend(window.views.menu.render().el);

        var $list = this.el.querySelectorAll('.swiper-container, .content-pagina');
        $list[0].style.height = (window.innerHeight - heightHeader) + 'px';
        $list[1].style.minHeight = ($list[0].style.height.replace('px','') - this.$el.find('.footer').getSize().height) + 'px';
        console.log(this.$el.find('.footer').getSize().height);
        console.log($list[0].style.height);

        this.model.unset('title');
        this.model.unset('type');
        this.parseJSON();
        return this;
    },
    scrolling:function(){
        if(this.swiper == null){
            var self =this;
            setTimeout(function(){
                self.swiper = new Swiper(self.el.querySelector('.swiper-container'),{
                scrollContainer: true,
                mode: 'vertical',
                scrollbar: {
                    container: '.swiper-scrollbar'
                }
            });
            },500);
        }else{
            this.swiper.reInit();
        }
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
        this.scrolling();
    },
    newPagina2:function(){
        var view = new Solana.Views.Pagina2({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
        this.scrolling();
    },
    newPagina3:function(){
        var view = new Solana.Views.Pagina3({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
        this.scrolling();
    },
    newPagina4:function(){
        var view = new Solana.Views.Pagina4({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
        this.scrolling();
    },
    newPromo:function(){
        var view = new Solana.Views.Promo({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
        this.scrolling();
    },
    newSubGaleria:function(){
        var view = new Solana.Views.SubGaleria({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
        backgroundLoading(view.el);
        this.scrolling();
        view.view_parent = this;
    },
    newEmbed:function(){
        var view = new Solana.Views.Embed({model:this.model});
        this.el.querySelector('div.content-pagina').appendChild(view.render().el) ;
    },
    parseJSON:function(){
        var self = this;
        this.$el.find('div.content-pagina').fadeOut(function(){
           $(this).empty().show();
            self.model.loadJSON();
        });
    }
});
    Solana.Views.Pagina1 = Backbone.View.extend({
        template: _.template($('#type1').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .url-interna':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            var url = this.model.get('urlinterna').split('/');
            app.navigate('#'+url[2]+'/'+url[0]+'/'+ url[1] +'/'+url[3],{trigger:true});
        }
    });
    Solana.Views.Pagina2 = Backbone.View.extend({
        template: _.template($('#type2').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .url-interna':'urlInterna'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            var url = this.model.get('urlinterna').split('/');
            app.navigate('#'+url[2]+'/'+url[0]+'/'+ url[1] +'/'+url[3],{trigger:true});
        }
    });
    Solana.Views.Pagina3 = Backbone.View.extend({
        template: _.template($('#type3').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .url-interna':'urlInterna',
            'tap .btn-interesa':'interesa'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            var url = this.model.get('urlinterna').split('/');
            app.navigate('#'+url[2]+'/'+url[0]+'/'+ url[1] +'/'+url[3],{trigger:true});
        },
        interesa:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            var reserva = new Solana.Views.Reserva({tipo:'Me Interesa',titulo:window.views.menu.model.get('title')});
            $('#pageActive').append(reserva.render().el);
            //reserva.$el.find('input').first().focus();
        }
    });
    Solana.Views.Pagina4 = Backbone.View.extend({
        template: _.template($('#type4').html()),
        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .url-interna':'urlInterna',
            'tap .btn-reserva':'reserva'
        },
        urlInterna:function(ev){
            ev.preventDefault();
            var url = this.model.get('urlinterna').split('/');
            app.navigate('#'+url[2]+'/'+url[0]+'/'+ url[1] +'/'+url[3],{trigger:true});
        },
        reserva:function(ev){
            ev.preventDefault();
            console.log(this.model.toJSON());
            var reserva = new Solana.Views.Reserva({tipo:'Reserva',titulo:window.views.menu.model.get('title')});
            $('#pageActive').append(reserva.render().el);
            //reserva.$el.find('input').first().focus();
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
    Solana.Views.SubGaleria = Backbone.View.extend({
        template: _.template($('#subgaleria').html()),
        view_parent:null,

        render:function () {
            this.setElement(this.template(this.model.toJSON()));
            return this;
        },
        events:{
            'tap .galeria-image':'item'
        },
        item:function(ev){
            ev.preventDefault();
            try{
                screen.unlockOrientation();
            }catch (e){}

            var fullimg =  new Solana.Views.FullView({model:this.model});
            fullimg.view_parent = this.view_parent;

            setTimeout(function(){
                fullimg.view_parent.scrolling();
                $('body').append(fullimg.render().el);
                fullimg.showSlider($(ev.target).attr('data-index'));
            },50);
        }
    });
    Solana.Views.Embed = Backbone.View.extend({
        template: _.template($('#embed').html()),
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
                navigator.notification.alert('Ha ocurrido un Error vuelva a intentarlo', null, 'Error');
        });
    },
    cancelar:function(ev){
        var self = this;
        self.$el.fadeOut('250',function(){
            self.$el.remove()
        });
    }
});
Solana.Views.FullView = Backbone.View.extend({
    template: _.template($('#fullView').html()),
    slider:null,
    view_parent:null,

    render:function () {
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },
    events:{
        'tap .swiper-slide > div':'cancelar'
    },
    showSlider:function(index){
        this.slider = new Swiper(this.el.querySelector('.swiper-container'),{
            noSwiping:true,
            noSwipingClass:'no-swipe',
            initialSlide:index
        });
    },
    cancelar:function(ev){
        if(ev.target.tagName != 'IMG'){
            var self = this;
            try{
                screen.lockOrientation('portrait');
            }catch (e){}

            setTimeout(function() {
                self.view_parent.scrolling();
            }, 50);

            self.$el.fadeOut('250',function(){
                self.$el.remove();
            });
        }
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
        if(fecha){
            var dia = new Solana.Views.ItemSlider({fecha:fecha});
            dia.view_parent = this;
            dia.collection = new Solana.Collections.DAS({ fecha: new Date(fecha).yyyymmdd(), id:this.model.get('id'), tabla:this.model.get('tabla') });
            dia.collection.on('add',dia.newPorDia,dia);

            this.$el.find('.bxslider').prepend(dia.render().el);
            dia.loadMoreView();
        }
    },
    loadPorDiaRight:function(fecha){
        if(fecha){
            var dia = new Solana.Views.ItemSlider({fecha:fecha});
            dia.view_parent = this;
            dia.collection = new Solana.Collections.DAS({fecha:new Date(fecha).yyyymmdd(), id:this.model.get('id'), tabla:this.model.get('tabla')});
            dia.collection.on('add',dia.newPorDia,dia);

            this.$el.find('.bxslider').append(dia.render().el);
            dia.loadMoreView();
        }
    },
    por_dia:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').addClass('active');
        ev.target.classList.add("active");

        var self = this;
        $(self.el.querySelector('.favorite')).fadeOut('fast',function(){
            $(self.el.querySelector('.content_por_dia')).fadeIn('300');
        });
    },
    favoritos:function(ev){
        this.$el.find('.tap-view > div').removeClass('active');
        this.$el.find('.tap-view > hr').removeClass('active');
        ev.target.classList.add("active");

        var self = this;
        $(self.el.querySelector('.content_por_dia')).fadeOut('fast',function(){
            $(self.el.querySelector('.favorite')).fadeIn('300');
        });
    },

    showSlider:function(index){
        var options = {
            controls: false,
            pager:false,
            infiniteLoop:false,
            touchEnabled:false/*,
            startSlide : index != null ? index:0*/
        };

        if(this.slider == null){
            this.slider = this.$el.find('ul.bxslider').bxSlider(options);
        }else{
            if(index == null)
                options['startSlide'] = this.slider.getCurrentSlide();
            else
                options['startSlide'] = index;

            this.slider.reloadSlider(options);
        }
    },
    backSlider:function(fecha){
        var current =  this.slider.getCurrentSlide();
        if(current == 0){
            this.loadPorDiaLeft(fecha);
            this.showSlider(1);
        }
        this.slider.goToPrevSlide();
    },
    nextSlider:function(fecha){
        var current =  this.slider.getCurrentSlide();
        if(current + 1  == this.slider.getSlideCount()){
            this.loadPorDiaRight(fecha);
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
                    JSON.stringify(getStorage(newCollection.url,null)) == JSON.stringify(newCollection.JSON())){
                    return;
                }
                setStorage(newCollection.url,newCollection.JSON());
                self.parseJSON();
                self.view_parent.showSlider(null);
            });
        },
        parseJSON:function(){
            this.$el.find('.list2').empty();
            this.collection.loadJSON();
            if(this.collection.previous == null)
                this.$el.find('.slider_left').hide();
            if(this.collection.next == null)
                this.$el.find('.slider_right').hide();
        },
        newPorDia:function(model){
            var view = new Solana.Views.Favorite({model:model});
            view.view_parent = this;
            var view_el = view.render().el;
            if(window.collections.favoritos.get(model.get('id'))){
                window.collections.favoritos.add(model, {merge: true});
                view_el.querySelector('.favorite-item').classList.add("active");
            }
            this.$el.find('.list2').append(view_el);
        },
        backSlider:function(ev){
            if(this.collection.previous != null){
                this.view_parent.backSlider(new Date(this.collection.previous).getTime());
            }
        },
        nextSlider:function(ev){
            if(this.collection.next != null){
                this.view_parent.nextSlider(new Date(this.collection.next).getTime());
            }
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
                    window.collections.favoritos.add(this.model, {merge: true});
                }
            }
            $(ev.target).toggleClass('active');
        }
    });