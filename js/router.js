/**
 * Created by Riter on 20/10/14.
 */
var AppRouter = Backbone.Router.extend({
    history: [],
    routes:{
        '(/:transition)': 'index',
        'home(/:transition)': 'index',
        'serv_horario':'servicio_horario',
        'item_serv_horario':'item_servicio_horario',
        'cron_das':'cronograma_das'
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
    servicio_horario:function(){
        app.changePage(new Solana.Views.ServicioHorario(), 'fade');
    },
    cronograma_das:function(){
        app.changePage(new Solana.Views.CronogramaDas(), 'fade');
    },
    item_servicio_horario:function(){
        app.changePage(new Solana.Views.CronogramaDas(), 'fade');
    }
});