/**
 * Created by Riter on 20/10/14.
 */
var AppRouter = Backbone.Router.extend({
    history: [],
    routes:{
        'home/:transition(/:reverse)': 'index',
        'tipo_1/:id/:tabla(/:titulo)':'pagina1',
        'tipo_2/:id/:tabla(/:titulo)':'pagina2',
        'tipo_3/:id/:tabla(/:titulo)':'pagina3',
        'tipo_4/:id/:tabla(/:titulo)':'pagina4',
        'tipo_galeria_nivel_2/:id/:tabla(/:titulo)':'subgaleria',
        'tipo_promo/:id/:tabla(/:titulo)':'promo',
        'embed/:id/:tabla(/:titulo)(/:reverse)':'embed',

        'tipo_especial/:id/:tabla(/:titulo)(/:reverse)':'crono_das',

        'secundario/:id/:tabla(/:titulo)(/:reverse)':'secundario',
        'secundario_galeria/:id/:tabla(/:titulo)(/:reverse)':'galeria',
        'secundario_videos/:id/:tabla(/:titulo)(/:reverse)':'video',
        'avisos/:id/:tabla(/:titulo)(/:reverse)':'avisos'
    },
    pushHistory:function(fragment){
        var split='';
        if(fragment){
            split= fragment.split('/');
        }else{
            split = Backbone.history.fragment.toString().split('/').filter(function(object){return object != 'reverse'});
        }
        this.history.push(split.join('/'));
        console.log(this.history);
    },
    popHistory:function(){
        this.history.pop();
        return this.history.pop();
    },
    lastHistoy:function(){
        return this.history[this.history.length-1];
    },
    initialize: function () {
        this.firstPage = true;
    },
    changePage: function (page, pagetransition, reverse, callback) {

        $(page.el).attr('data-role', 'page').attr('id', 'pageActive');
        page.render();

        $('body').css('display','block').append($(page.el));

        var transition = pagetransition?pagetransition:'none';

        page.$el.on('pageshow', function(event, ui) {
            if(typeof callback == 'function')
                callback();
        });

        if (reverse) {
            $.mobile.changePage($(page.el), {changeHash:false, transition: transition, reverse:true});
        }else{
            $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
        }

    },
    index:function(transition,reverse){
        app.pushHistory();
        var index = new Solana.Views.Index();
        app.changePage(index, transition?transition:'none');
        index.loadBanner();
    },
    /* categorias */
    secundario:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo,type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newSecundario,view);

        app.changePage(view, 'fade');
        if(! reverse)
            view.loadMoreView();
    },
    galeria:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo,type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newGaleria,view);

        app.changePage(view, 'fade');
        if(! reverse)
            view.loadMoreView();
    },
    video:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo, type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newVideo,view);

        app.changePage(view, 'fade');
        if(! reverse)
            view.loadMoreView();
    },
    avisos:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo, type:'none'});
        view.collection = new Solana.Collections.Aviso();
        view.collection.on('add',view.newAviso,view);

        app.changePage(view, 'fade');
        if(! reverse)
            view.loadMoreView();
    },
    /* paginas */
    pagina1:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newPagina1,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    pagina2:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newPagina2,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    pagina3:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newPagina3,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    pagina4:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newPagina4,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    promo:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newPromo,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    subgaleria:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newSubGaleria,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    embed:function(id,tabla,titulo){
        app.pushHistory();
        var view = new Solana.Views.Pagina();
        view.model = new Solana.Models.Pagina({title:titulo, id:id, tabla:tabla, type:'back'});
        view.model.on('clear',view.newEmbed,view);

        app.changePage(view, 'fade');
        view.loadView();
    },
    crono_das:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.CronogramaDas({title:titulo, type:'none',id:id,tabla:tabla});
        window.collections.favoritos.off('add change remove').on('add change remove',view.newFavorite,view);

        app.changePage(view, 'fade',null,function(){
            view.newFavorite(null);
            view.showSlider(0);
        });
        view.loadPorDiaRight(new Date().getTime());
        view.showSlider(0);
    }
});