/**
 * Created by Riter on 20/10/14.
*/

/* Variables*/
    var pushNotification = null;
    window.vars.favoritos = null;
    window.views.menu = window.models.mobile = null;
/* initialize Document y Phonegap */
function onDeviceReady() {
    $.mobile.defaultHomeScroll = 0;

    pushNotification = new NotificationsPlugin();

    setTimeout(function() {
        try{
            navigator.splashscreen.hide();
        }catch(err){}
    }, 100);

    window.app = new AppRouter();
    Backbone.history.start();

    window.views.menu = new Solana.Views.Menu();
    window.views.menu.loadMoreView();

    window.models.mobile = new Solana.Models.Mobile();
    if(getStorage('mobile',null)){
        window.models.mobile.set(getStorage('mobile',null));
        window.models.mobile.load();
    }else{
        pushNotification.initialize(function(){
            window.models.mobile.set({udid: pushNotification.getDeviceToken(), dispositivo: pushNotification.getDevice()});
            window.models.mobile.load(function(){
                setStorage('mobile',window.models.mobile.toJSON());
            });
        });
    }
    app.navigate( '#home/fade' ,{trigger: true});
}

document.addEventListener("deviceready", onDeviceReady, false);

document.addEventListener("resume", function(){
    window.views.menu.loadMoreView();
    window.models.mobile.load();
}, false);
