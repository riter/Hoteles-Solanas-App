var api_host = 'http://html5cooks.com/solana/ServiciosMobiles';
//var api_host = 'http://test.solana.com/Hoteles-Solanas/ServiciosMobiles';

$(document).on("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

    $.mobile.changePage.defaults.allowSamePageTransition = true;
    $.support.cors = true;
    $.mobile.allowCrossDomainPages=true;
    $.mobile.touchOverflowEnabled = true;

    $(document).on('pagehide',function (event) {
       $(event.target).remove();
    });

});

window.Solana={};

Solana.Models={};
Solana.Collections={};
Solana.Views={};
Solana.Routers={};

window.models={};
window.collections={};
window.views={};
window.routers={};
window.vars={};

/* functions */
function formatDateYear (string) {
    if(string!='' && string!=null){
        var post_date = (string.split(' ')[0]).split('-'),
            months = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            post_date[1] = months[parseInt(post_date[1])];
        return post_date;
    }
    return ['','',''];
}

$.fn.getSize = function() {
    var $wrap = $(this).clone().appendTo($("body"));
    $wrap.css({
        "position":   "absolute !important",
        "visibility": "hidden !important",
        "display":    "block !important"
    });
    var sizes = {
        width: $wrap.width(),
        height: $wrap.height()
    };
    $wrap.remove();
    return sizes;
};

function getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
        month = '0'+month;
    }
    if(day.toString().length == 1) {
        day = '0'+day;
    }
    if(hour.toString().length == 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        second = '0'+second;
    }
    return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
}