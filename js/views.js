/**
 * Created by Riter on 20/10/14.
 */

Solana.Views.Menu = Backbone.View.extend({
    template: _.template($('#menu').html()),
    model: Solana.Models.Menu,

    initialize:function(title){
        this.model = new Solana.Models.Menu();

        if(title != undefined && title != ''){
            this.model.set(title);
        }
    },
    render:function () {
        console.log(this.model.get('title'));
        this.setElement(this.template({title: this.model.get('title')}));

        this.el.querySelector('ul.menu-izq').style.maxHeight = (window.innerHeight - 63) + 'px';
        return this;
    },
    events:{
        'click div.icon-izq':'toggleMenuIzq',
        'click div.ave':'toggleMenuIzq',
        'click div.icon-der':'toggleMenuDer',
        'click h1.logo':'logo'
    },
    logo:function(ev){
        app.navigate( '#home/fade' ,{trigger: true});
    },
    toggleMenuIzq:function(ev){
        this.el.querySelector('.menu-der').style.display = 'none';

        var element = this.el.querySelector('.menu-izq');
        element.style.display = element.style.display == 'block'?'':'block';
    },
    toggleMenuDer:function(ev){
        this.el.querySelector('.menu-izq').style.display = 'none';

        var element = this.el.querySelector('.menu-der');
        element.style.display = element.style.display == 'block'?'':'block';
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
        this.el.appendChild(this.menu.render().el);
        return this;
    }
});

Solana.Views.ServicioHorario = Backbone.View.extend({
    template: _.template($('#serv_horario').html()),
    menu:Solana.Views.Menu,
    slider:null,

    initialize:function(){
        this.menu = new Solana.Views.Menu()
    },
    render:function () {
        $(this.el).html(this.template());
        this.el.appendChild(this.menu.render().el);

        this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - 63) + 'px';
        return this;
    },
    events:{
        'click ul.list li.item': 'showSlider'
    },
    hideSlider:function(ev){
        this.$el.find('ul.list, ul.bxslider').toggle();
    }
    /*slider:function(){
        this.slider = this.$el.find('ul.bxslider').bxSlider({
            controls: false,
            pager:false,
            startSlide: $(ev.target).parents('li.item').attr("data-index")
        });
        this.slider.goToPrevSlide();
        this.slider.goToNextSlide();
    }*/
});

    Solana.Views.Type1 = Backbone.View.extend({
        template: _.template($('#item_serv_horario').html()),
        menu:Solana.Views.Menu,

        initialize:function(){
            this.menu = new Solana.Views.Menu()
        },
        render:function () {
            $(this.el).html(this.template());
            this.el.appendChild(this.menu.render().el);

            //this.el.querySelector('ul.list').style.maxHeight = (window.innerHeight - 63) + 'px';
            return this;
        },
        events:{
            'click ul.list li.item': 'showSlider'
        },
        hideSlider:function(ev){
            this.$el.find('ul.list, ul.bxslider').toggle();
        }

    });

Solana.Views.CronogramaDas = Backbone.View.extend({
    template: _.template($('#cronograma_das').html()),
    menu:Solana.Views.Menu,
    slider:null,

    initialize:function(){
        this.menu = new Solana.Views.Menu()
    },
    render:function () {
        $(this.el).html(this.template());
        this.el.appendChild(this.menu.render().el);
        return this;
    },
    events:{
        'tap ul.list li.item': 'showSlider',
        'tap div.title h2':'hideSlider',
        'tap div.slider_left':'backSlider',
        'tap div.slider_right':'nextSlider'
    },
    hideSlider:function(ev){
        this.$el.find('ul.list, ul.bxslider').toggle();
    },
    showSlider:function(ev){
        this.$el.find('ul.list, ul.bxslider').toggle();

        if(this.slider != null)
            this.slider.destroySlider();

        this.slider = this.$el.find('ul.bxslider').bxSlider({
            controls: false,
            pager:false,
            startSlide: $(ev.target).parents('li.item').attr("data-index")
        });

    },
    backSlider:function(){
        this.slider.goToPrevSlide();
    },
    nextSlider:function(){
        this.slider.goToNextSlide();
    }
});