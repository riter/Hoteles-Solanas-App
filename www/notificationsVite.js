/**
 * Created by Riter on 11/09/14.
 */

function onNotificationAPN(e) {
    pushNotification.onNotificationAPN(e);
}

var onNotificationGCM = function(e){
    pushNotification.onNotificationGCM(e);
};

var NotificationsPlugin = function(){
    var device_token = null;
    this.notification = null;

    this.tokenHandler = function (result) {
        device_token = result;
    };
    this.errorHandler = function (result) {
    };

    this.getDeviceToken = function(){
      return device_token;
    };

    this.successHandler = function (result) {
    };

    this.initialize = function(){
        try{
            this.notification = window.plugins.pushNotification;
            var self = this;
            if (window.device.platform == 'android' || device.platform == 'Android') {
                this.notification.register(
                    self.successHandler,
                    self.errorHandler, {
                        "senderID":"971027894286", // Project number from Google Developer Console
                        "ecb":"onNotificationGCM"
                    }
                );
            }else{
                this.notification.register(self.tokenHandler, self.errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
            }
        }catch (e){ }
    };

    this.onNotificationGCM =function(e) {
        try{
            switch( e.event ){
                case 'registered':
                    if ( e.regid.length > 0 ){
                        this.tokenHandler(e.regid);
                    }
                    break;

                case 'message':
                    if (e.foreground){
                        //var my_media = new Media("/android_asset/www/"+e.soundname);
                        //my_media.play();
                    }
                    break;
            }
        }catch (e){
        }
    };

    this.onNotificationAPN = function(e) {
        try{
            var self = this;
            if (e.badge) {
                this.notification.setApplicationIconBadgeNumber(self.successHandler,e.badge);
            }
            if (e.sound) {
            }
        }catch (er){
        }
    };
    this.initialize();
};

function dowloadImage(url){
    try{

        var downloadUrl = url;
        var relativeFilePath = "download/banner.png";  // using an absolute path also does not work

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(
                downloadUrl,
                fileSystem.root.toURL() + '/' + relativeFilePath,
                function (entry) {
                    $('#banner').attr('src',entry.toURI());

                    alert("Success" + entry.toURI());
                    localStorage['banner'] = JSON.stringify(entry.nativeURL);
                    alert(JSON.parse(localStorage['banner']));
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
var pushNotification = null;
function onDeviceReady() {

    dowloadImage('HTTP://html5cooks.com/solana/app/webroot/uploads/categorias/271465234.82-map-route.png');

    pushNotification = new NotificationsPlugin();
}
document.addEventListener("deviceready", onDeviceReady, false);
