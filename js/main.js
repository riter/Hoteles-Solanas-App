/**
 * Created by Riter on 20/10/14.
 */

function onDeviceReady() {

    setTimeout(function() {
        try{
            navigator.splashscreen.hide();
        }catch(err){}
    }, 100);

    window.app = new AppRouter();
    Backbone.history.start();

}

document.addEventListener("deviceready", onDeviceReady, false);
