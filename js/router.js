/**
 * Created by Riter on 20/10/14.
 */
var AppRouter = Backbone.Router.extend({
    history: [],
    routes:{
        //'(/:transition)': 'index',
        'home(/:transition)': 'index',

        'serv_horario(/:reverse)':'servicio_horario',
        'item_type1/:id':'item_type1',
        'item_type3/:id':'item_type3',

        'cron_das':'cronograma_das',
        'gastronomia(/:reverse)':'gastronomia',

        'videos':'videos',

        'galerias(/:reverse)':'galerias',
        'item_gallery':'item_gallery',

        'datos_utiles(/:reverse)':'datos_utiles',
        'avisos(/:reverse)':'avisos',

        'kids':'kids',
        'plano_complejo':'plano_complejo'
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
    index:function(transition){
        app.changePage(new Solana.Views.Index(), transition?transition:'none');
    },
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
        app.changePage(new Solana.Views.Galerias(), 'fade');
    },
    item_gallery:function(){
        app.pushHistory();
        app.changePage(new Solana.Views.ItemsGalerias(), 'fade');
    },
    datos_utiles:function(){
        app.pushHistory();
        app.changePage(new Solana.Views.DatosUtiles(), 'fade');
    },
    avisos:function(){
        app.pushHistory();
        app.changePage(new Solana.Views.Avisos(), 'fade');
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