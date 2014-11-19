/**
 * Created by Riter on 11/11/14.
 */
// Setup push notifications:

var initPushNotifications = function(){
    try
    {
        alert('Init');
        var pushNotification = window.plugins.pushNotification;
        if (window.device.platform == 'android' || device.platform == 'Android') {
            // Register for Android:
            pushNotification.register(
                pushSuccessHandler,
                pushErrorHandler, {
                    "senderID":"971027894286", // Project number from Google Developer Console
                    "ecb":"onNotificationGCM"
                }
            );
        }
    }
    catch(err)
    {
        // For this example, we'll fail silently ...
        console.log(err);
    }
};
/**
 * Success handler for when connected to push server
 * @param result
 */
var pushSuccessHandler = function(result)
{
    alert('pushSuccessHandler' +JSON.stringify(result));
};

/**
 * Error handler for when not connected to push server
 * @param error
 */
var pushErrorHandler = function(error)
{
    alert('pushErrorHandler' + JSON.stringify(error));
};

/**
 * Notification from Android GCM
 * @param e
 */
var onNotificationGCM = function(e)
{
    // Check which event:
    switch(e.event)
    {
        case 'registered' :
        {
            prompt('ID',e.regid);
            break;
        }
    }
};