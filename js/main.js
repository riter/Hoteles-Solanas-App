/**
 * Created by Riter on 20/10/14.
*/

/* Variables*/
    window.vars.favoritos = null;

/* initialize Document y Phonegap */
function onDeviceReady() {
    $.mobile.defaultHomeScroll = 0;

    setTimeout(function() {
        try{
            navigator.splashscreen.hide();
        }catch(err){}
    }, 100);

    window.app = new AppRouter();
    Backbone.history.start();
    app.navigate( '#home/fade' ,{trigger: true});

}

document.addEventListener("deviceready", onDeviceReady, false);
