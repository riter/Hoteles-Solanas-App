var api_host = 'http://solana.html5cooks.com/ServiciosMobiles';
//var api_host = 'http://localhost/Hoteles-Solanas/Hoteles-Solanas/ServiciosMobiles';

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
    var $wrap = this.clone();
    $wrap.appendTo("body");
    $wrap.css({
        position:   "absolute",
        visibility: "hidden",
        display:    "block"
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
Date.prototype.hhmm = function() {
    var hour    = this.getHours();
    var minute  = this.getMinutes();
    return (hour[1]?hour:"0"+hour[0]) + ':' + (minute[1]?minute:"0"+minute[0]);
};

String.prototype.hhmm = function() {
    var self = this;
    var separatorLocal = new Date().toLocaleDateString().indexOf('/')>-1?'/':'-';
    self = self.replace(/-/gi,separatorLocal);

    try{
        var date = new Date(self);
        var hour    = date.getHours().toString();
        var minute  = date.getMinutes().toString();
        return (hour[1]?hour:"0"+hour[0]) + ':' + (minute[1]?minute:"0"+minute[0]);
    }catch (e){
        return '';
    }
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

function getYouTubeLink(url) {
    /*var isYouTube = RegExp(/\.youtube\.com.+v=([\w_\-]+)/i);
    var r = isYouTube.exec(url);
    if (r && r[1]) {
        var video = 'http://www.youtube.com/v/' + r[1] + '&hl=en&fs=1&';
        var youtube =  '<embed src="' + video + '" type="application/x-shockwave-flash"' +
            ' allowscriptaccess="always"' +
            ' allowfullscreen="true" width="100%" height="184"></embed>';

        console.log(youtube);
        return youtube;
    }*/
    var videoid= url.substring(url.lastIndexOf('=')+1);
    if(videoid == url){
        videoid= url.substring(url.lastIndexOf('/')+1);
    }
    if(url != ""){
        return '<iframe type="text/html" width="100%" height="180" src="http://www.youtube.com/embed/'+videoid+'?wmode=transparent" frameborder="0" allowfullscreen allowscriptaccess="always"></iframe>';
    }
    else{
        return '';
    }
}

/* el event load de un img llama a esta funcion he inserta la imagen como backgroun al elemento siguiente
*   ej: <img src="urlimagen">
*       <div><div/> este elemento estara con background de la imagen
* */
function loadImg(self){
    $(self).next().css('background-image',"url('"+$(self).attr('src')+"')");
}