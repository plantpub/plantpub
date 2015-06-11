
// wechat share config
~function(window) {
    var path = location.protocol+"//"+location.host+location.pathname.replace(/[^\/]+$/,'')
    window.shareConfig = {
        img_url: path+'images/share-ico.png',
        img_width: 80,
        img_heigth: 80,
        link: location.href,
        title: '刷个朋友圈的工夫都能开店了',
        desc: '太快了，刷个朋友圈的工夫都能赚钱了'
    }

    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        init()
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", init, false)
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", init)
            document.attachEvent("onWeixinJSBridgeReady", init)
        }
    }
    function init(){
        WeixinJSBridge.on("menu:share:appmessage", shareToFriend);
        WeixinJSBridge.on("menu:share:timeline", shareToFriends);
        document.getElementById('car_audio').play();
        document.getElementById('video').play();
    }
    function shareToFriend(){
        WeixinJSBridge.invoke("sendAppMessage", shareConfig, function (res) {
        })
    }
    function shareToFriends(){
        WeixinJSBridge.invoke("shareTimeline", shareConfig, function (res) {
        })
    }
}(self);
