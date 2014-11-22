/**
 * Created by Riter on 20/10/14.
 */
var AppRouter = Backbone.Router.extend({
    history: [],
    routes:{

        /*'serv_horario(/:reverse)':'servicio_horario',
        'item_type1/:id':'item_type1',
        'item_type3/:id':'item_type3',

        'cron_das':'cronograma_das',
        'gastronomia(/:reverse)':'gastronomia',

        'videos':'videos',

        'galerias(/:reverse)':'galerias',
        'list_image/:id':'list_image',

        'datos_utiles(/:reverse)':'datos_utiles',
        'avisos(/:reverse)':'avisos',

        'kids':'kids',
        'plano_complejo':'plano_complejo',*/

        //nuevos
        'home/:transition(/:reverse)': 'index',
        'tipo_1/:id/:tabla(/:titulo)':'pagina1',
        'tipo_2/:id/:tabla(/:titulo)':'pagina2',
        'tipo_3/:id/:tabla(/:titulo)':'pagina3',
        'tipo_4/:id/:tabla(/:titulo)':'pagina4',
        'tipo_promo/:id/:tabla(/:titulo)':'promo',

        'secundario/:id/:tabla(/:titulo)(/:reverse)':'secundario',
        'secundario_galeria/:id/:tabla(/:titulo)(/:reverse)':'galeria',
        'secundario_galeria_nivel2/:id/:tabla(/:titulo)(/:reverse)':'subgaleria',
        'secundario_videos/:id/:tabla(/:titulo)(/:reverse)':'video',
        'avisos(/:reverse)':'avisos'
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
    },
    /* categorias */
    secundario:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo,type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newSecundario,view);

        app.changePage(view, 'fade');
        view.loadMoreView();
    },
    galeria:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo,type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newGaleria,view);

        app.changePage(view, 'fade');
        view.loadMoreView();
    },
    subgaleria:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo,type:'none'});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newSubGaleria,view);

        app.changePage(view, 'fade');
        view.loadMoreView();
    },
    video:function(id,tabla,titulo,reverse){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:titulo});
        view.collection = new Solana.Collections.Categoria({id:id, tabla:tabla});
        view.collection.on('add',view.newVideo,view);

        app.changePage(view, 'fade');
        view.loadMoreView();
    },
    avisos:function(){
        app.pushHistory();
        var view = new Solana.Views.Categorias({title:'Avisos'});
        view.collection = new Solana.Collections.Avisos();
        view.collection.on('add',view.newAviso,view);

        app.changePage(view, 'fade');
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
    /* end nuevos*/
    servicio_horario:function(reverse){
        app.pushHistory();
        var serv = new Solana.Views.ViewList({title: 'Servicios y horarios',item_type:'1'});
        app.changePage(serv, 'fade');
        serv.collection.url = api_host + '/listarServiciosYHorarios';

        if(reverse){
            serv.parseJSON(getStorage(app.lastHistoy(),null));
        }else{
            serv.loadMoreView();
        }
    },
    item_type1:function(id){
        app.pushHistory();

        var model = new Solana.Models.Type1(getStorage(app.lastHistoy(),null));
        app.changePage(new Solana.Views.Type1(model.toJSON()), 'fade');
    },
    cronograma_das:function(){
        var crono = new Solana.Views.CronogramaDas();
        app.changePage(crono, 'fade',null,function(){
            crono.showSlider();
        });
    },
    gastronomia:function(reverse){
        app.pushHistory();
        var serv = new Solana.Views.ViewList({title: 'Gastronomia',item_type:'3'});
        app.changePage(serv, 'fade');
        serv.collection.url = api_host + '/listarGastronomias';

        if(reverse){
            serv.parseJSON(getStorage(app.lastHistoy(),null));
        }else{
            serv.loadMoreView();
        }
    },
    item_type3:function(id){
        app.pushHistory();

        var type = new Solana.Views.Type3(getStorage('item_type3/'+id,null));

        var serv = new Solana.Views.ViewList({title: type.model.get('title'),type:'back'});
        app.changePage(serv, 'fade');

        type.render(serv);
    },
    videos:function(){
        var videos = new Solana.Views.Videos();
        app.changePage(videos, 'fade');
        videos.collection.loadMore();
    },
    galerias:function(reverse){
        app.pushHistory();
        var serv = new Solana.Views.Galerias({title: 'Galeria de fotos'});
        app.changePage(serv, 'fade');

        if(reverse){
            serv.parseJSON(getStorage(app.lastHistoy(),null));
        }else{
            if(getStorage(app.lastHistoy(),null)){
                serv.parseJSON(getStorage(app.lastHistoy(),null));
            }
            serv.loadMoreView();
        }
    },
    list_image:function(id){
        app.pushHistory();
        app.changePage(new Solana.Views.GaleryImages(getStorage('list_image/'+id,null)), 'fade');
    },
    datos_utiles:function(){
        app.pushHistory();
        app.changePage(new Solana.Views.DatosUtiles(), 'fade');
    },
    kids:function(){
        app.pushHistory();
        var serv = new Solana.Views.ViewList({title: 'Solana kids'});
        app.changePage(serv, 'fade');

        var type = new Solana.Views.Type3();
        type.model.url = api_host + '/listarSolanasKids';
        type.loadModel(serv);

    },
    plano_complejo:function(){
        app.pushHistory();
        var serv = new Solana.Views.ViewList({title: 'Solana kids'});
        app.changePage(serv, 'fade');

        var type = new Solana.Views.Type3();
        type.model.url = api_host + '/listarPlanos';
        type.loadModel(serv);

    }
});