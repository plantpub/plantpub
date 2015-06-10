function isAndroid(){ // 判断是否安卓
    var os = new Array("Android");
    var info = navigator.userAgent;
    var len = os.length;
    for (var i = 0; i < len; i++) {
        if (info.indexOf(os[i]) > 0){
            return true;
        }
    }
    return false;
}
function isIOS(){ // 判断是否IOS
    var os = new Array("iPhone","iPad","iPod");
    var info = navigator.userAgent;
    var len = os.length;
    for (var i = 0; i < len; i++) {
        if (info.indexOf(os[i]) > 0){
            return true;
        }
    }
    return false;
}
function isWeixin(){ // 判断是否微信
    var os = new Array("MicroMessenger");
    var info = navigator.userAgent;
    var len = os.length;
    for (var i = 0; i < len; i++) {
        if (info.indexOf(os[i]) > 0){
            return true;
        }
    }
    return false;
}

function setDownloadUrl() {
    var url;
    if (isIOS()) {
        url = 'https://itunes.apple.com/us/app/kai-wei-dian/id941503234?ls=1&mt=8'
        if (isWeixin()) {
            url = 'http://mp.weixin.qq.com/mp/redirect?url=' + encodeURIComponent(url)
        }
    } else {
        // url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.paipai.wxd'
        url = 'http://static.paipaiimg.com/ppwd/down/PPWD_2.0.8_officialWebSite.apk'
        // if (isWeixin()) {
        // 	url = 'http://mp.weixin.qq.com/mp/redirect?url=' + encodeURIComponent(url)
        // }
    }
    document.getElementById('download-btn').setAttribute('href', url)
}