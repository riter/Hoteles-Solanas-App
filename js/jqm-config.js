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