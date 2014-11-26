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
function dowloadImage(url,nameFile,callback){
    try{
        /* parece q este codigo es para andriod y iphone
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
         */

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(
                url,
                fileSystem.root.toURL() + '/'+nameFile,
                function (entry) {
                    if(typeof callback == 'function') callback(entry.toURI());
                },
                function (error) {
                    alert("Error:" + + JSON.stringify(error));
                }
            );
        });

    }catch(e){
        alert('Catch:' + JSON.stringify(e));
    }
}

Date.prototype.yyyymmdd = function() {
    var separator = this.toLocaleDateString().indexOf('/')>-1?'/':'-';

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();

    return yyyy + separator + (mm[1]?mm:"0"+mm[0]) + separator + (dd[1]?dd:"0"+dd[0]);
};
Date.prototype.ddmm = function() {
    var separator = this.toLocaleDateString().indexOf('/')>-1?'/':'-';

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();

    return (dd[1]?dd:"0"+dd[0]) + separator + (mm[1]?mm:"0"+mm[0]);
};

function formatDayDate(time){ // Date().getTime();
    if(time != '' && time != null){
        var pos_date = new Date(time),
            date = new Date();

        if(pos_date.yyyymmdd() == date.yyyymmdd()){
            return 'Hoy ' + pos_date.ddmm();
        }else{
            var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
            return days[pos_date.getDay()] + ' ' + pos_date.ddmm();
        }
    }
    return '';
}
function formatDateLiteral(time){ // Date().getTime();
    if(time != '' && time != null){
        var pos_date = new Date(time);

        var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        return days[pos_date.getDay()] + ' ' + pos_date.getDate() + ' de ' + months[pos_date.getMonth()];

    }
    return '';
}
/**
 * @return {number}
 */
function DayAnterior(time){
    var dateafter = new Date(time - (1000 * 60 * 60 * 24));
    return dateafter.getTime();
}
/**
 * @return {number}
 */
function DaySiguiente(time){
    var dateaafter = new Date(time + (1000 * 60 * 60 * 24));
    return dateaafter.getTime();
}