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
    this.device_token = 'ae9ffef0d0d527799a48cbd0a3706f571a3325b4832e852d54f62c79aac5e03b';
    this.device = 'ios';
    this.notification = null;

    this.tokenHandler = function (result) {
        this.device_token = result;
    };
    this.errorHandler = function (result) {
    };
    this.successHandler = function (result) {
    };

    this.getDeviceToken = function(){
        return this.device_token;
    };
    this.getDevice = function(){
        return this.device;
    };

    this.initialize = function(callback){
        try{
            this.device = window.device.platform;
            this.notification = window.plugins.pushNotification;

            var self = this;
            if (window.device.platform == 'android' || device.platform == 'Android') {
                this.notification.register(
                    function(result){
                        self.successHandler(result);
                        setTimeout(function(){
                            if(typeof callback == 'function') callback();
                        },2000);
                    },
                    self.errorHandler, {
                        "senderID":"971027894286", // Project number from Google Developer Console
                        "ecb":"onNotificationGCM"
                    }
                );
            }else{
                this.notification.register(function(result){
                    self.tokenHandler(result);
                    if(typeof callback == 'function') callback();
                }, self.errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
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
                        /*var my_media = new Media("/android_asset/www/"+e.soundname);
                        my_media.play();*/
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
};