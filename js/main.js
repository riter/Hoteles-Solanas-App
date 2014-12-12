/**
 * Created by Riter on 20/10/14.
*/

/* Variables*/
    var pushNotification = null;
    window.views.menu = window.models.mobile = window.collections.favoritos = null;
    window.models.banner = null;
/* initialize Document y Phonegap */
function onDeviceReady() {
    $.mobile.defaultHomeScroll = 0;

    pushNotification = new NotificationsPlugin();

    window.app = new AppRouter();
    Backbone.history.start();

    window.views.menu = new Solana.Views.Menu();
    window.views.menu.loadMoreView();

    window.models.mobile = new Solana.Models.Mobile();
    window.models.mobile.parseJSON();

    pushNotification.initialize(function(){
        window.models.mobile.set({udid: pushNotification.getDeviceToken(), dispositivo: pushNotification.getDevice()});
        window.models.mobile.load(function(){
            setStorage('mobile',window.models.mobile.toJSON());
        });
    });

    window.collections.favoritos = new Solana.Collections.DAS();
    if(getStorage('favorites',null)){
        window.collections.favoritos.set(getStorage('favorites',null));
    }

    app.navigate( '#home/none' ,{trigger: true});

    setTimeout(function() {
        try{
            navigator.splashscreen.hide();
            screen.lockOrientation('portrait');
        }catch(err){}
    }, 100);
}

document.addEventListener("deviceready", onDeviceReady, false);

document.addEventListener("resume", function(){
    window.views.menu.loadMoreView();
    window.models.mobile.load();
}, false);
