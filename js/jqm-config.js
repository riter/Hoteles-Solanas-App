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
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var directoryEntry = fileSystem.root; // to get root path to directory
            directoryEntry.getDirectory("Solanas Images", {create: true, exclusive: false}, function(entry){
                var fp = entry.toURI();
                fp = fp+"/"+nameFile;
                var fileTransfer = new FileTransfer();
                fileTransfer.download(url,fp,
                    function(entry) {
                        if(typeof callback == 'function') callback(entry.toURI());
                    },
                    function(error) {
                        //alert("Error:" + JSON.stringify(error));
                    }
                );
            }, null);
        });
    }catch(e){
        //alert('Catch:' + JSON.stringify(e));
    }
}

function saveImageToPhoneAndriod(url, success, error, nameFile) {
    try{
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var directoryEntry = fileSystem.root; // to get root path to directory
            directoryEntry.getDirectory("Solanas Images", {create: true, exclusive: false}, function(entry){
                var fp = entry.toURI();
                fp = fp+"/"+nameFile;
                var fileTransfer = new FileTransfer();
                fileTransfer.download(url,fp,success,error);
            }, null);
        });
    }catch(e){
        //alert('Catch:' + JSON.stringify(e));
    }
}
function saveImageToPhone(url, success, error) {
    var canvas, context, imageDataUrl, imageData;
    var img = new Image();

    try {
        img.onload = function() {
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);

            try {
                imageDataUrl = canvas.toDataURL('image/jpeg');
                imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
                cordova.exec(
                    success,
                    error,
                    'Canvas2ImagePlugin',
                    'saveImageDataToLibrary',
                    [imageData]
                );
            }
            catch(e) {
                error(e.message);
            }

            try {
                imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
                imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');


                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function(msg){
                        //alert('The image was saved to the photos gallery on your device.');
                        $("#popupBasic").popup("open")
                    },
                    function(err){
                        //alert('There was a problem saving the image to your device.');
                    },
                    canvas
                );
            }
            catch(e) {
                error(e.message);
            }
        };
        img.src = url;
    }
    catch(e) {
        error(e.message);
    }
}

function saveImageToPhoneIOS(url, success, error) {
    var canvas, context, imageDataUrl, imageData;
    var img = new Image();
    img.onload = function() {
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        try {
            imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
            imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
            window.canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg){
                    //alert('The image was saved to the photos gallery on your device.');
                },
                function(err){
                    //alert('There was a problem saving the image to your device.');
                },
                canvas
            );
            /*cordova.exec(
                success,
                error,
                'Canvas2ImagePlugin',
                'saveImageDataToLibrary',
                [imageData]
            );*/
        }
        catch(e) {
            error(e.message);
        }
    };
    img.src = url;
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

    try{
        var arr = self.valueOf().split(/[- :]/);
        var date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
        var hour    = date.getHours().toString();
        var minute  = date.getMinutes().toString();
        return hour + ':' + (minute>9?minute:"0"+minute);
    }catch (e){
        return '';
    }
};

String.prototype.toDate = function() {
    var m = this;
    var arr = m.indexOf('/')>-1? m.split(/[/ :]/):m.split(/[- :]/);
    if(arr.length>3)
        return new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
    else
        return new Date(arr[0], arr[1]-1, arr[2], '00', '00', '00');
}

function formatDayDate(time){ // Date().getTime();
    try{
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
    }catch (e){
        return '';
    }
}
Date.prototype.formatDateLiteral = function(){ // Date().getTime();
    try{

        //if(time != '' && time != null){
            var pos_date = this;

            var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

            return days[pos_date.getDay()] + ' ' + pos_date.getDate() + ' de ' + months[pos_date.getMonth()];

        //}
    }catch (e){
        return '';
    }
}
function getYouTubeLink(url) {
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

function zoomDisable(){
    $('head meta[name=viewport]').remove();
    $('<meta>', {name: 'viewport',content: 'width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no'}).appendTo('head');
}
function zoomEnable(){
    $('head meta[name=viewport]').remove();
    $('<meta>', {name: 'viewport',content: 'width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=2.0, user-scalable=yes'}).appendTo('head');
}

function backgroundLoading(self){
    var elems = self.querySelectorAll('.loading');
    for(var i=0; i<elems.length; i++){

        setTimeout(function(item){
            var newImg = new Image();
            newImg.src = item.getAttribute('data-url');
            newImg.onload = function() {
                $(item).css('background-image',"url('"+this.src+"')");
            };
        }, 100, elems[i]);

    }
}