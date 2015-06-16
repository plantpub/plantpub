window.BT = window.BT || {}, BT.OpenApp = {
    parseUrl: function (a) {
        var b = "", c = "", d = "";
        switch (a.pageType) {
            case"trip":
                b = "breadtrip://browsetrip?tripid=" + a.tripId;
                break;
            case"waypoint":
                b = "breadtrip://browsetrip?tripid=" + a.tripId + "&waypointid=" + a.waypointId;
                break;
            case"comment":
                b = "breadtrip://comment?tripid=" + a.tripId + "&waypointid=" + a.waypointId;
                break;
            case"user":
                b = "breadtrip://userinfo?userid=" + a.userid;
                break;
            case"country_city":
            case"poi":
                c = "breadtrip://destination?type=" + a.destType + "&id=" + a.destId, b = "breadtrip://destination?name=" + encodeURIComponent(a.destName) + "&type=" + a.destType + "&id=" + a.destId;
                break;
            case"webview":
                b = "breadtrip://webview?url=" + encodeURIComponent(a.url);
                break;
            case"explore":
                b = "breadtrip://explore";
                break;
            default:
                b = "breadtrip://main"
        }
        return {
            iosUrl: c,
            androidUrl: d,
            url: b
        }
    },
    isInWx: function () {
        return RegExp("MicroMessenger").test(navigator.userAgent)
    },
    wx: {
        isAppInstalled: function (a) {
            wx.ready(function () {
                wx.invoke("getInstallState", {
                    packageName: "com.hothuati.RHCT",
                    packageUrl: "rhcthothuati://"
                }, function (b) {
                    "function" == typeof a && a("get_install_state:yes" == b.err_msg ? !0 : !1)
                })
            })
        },
        launchApp: function (a, b) {
            wx.ready(function () {
                wx.invoke("launch3rdApp", {
                    appID: "wxe334a1e34a01d971",
                    messageExt: encodeURI(a.iosUrl || a.url),
                    extInfo: encodeURI(a.androidUrl || a.url)
                }, function (a) {
                    "function" == typeof b && b("launch_3rdApp:ok" == a.err_msg ? !0 : !1)
                })
            })
        }
    },
    other: {
        launchApp: function (a, b) {
            "None" == $("body").data("version") && 0 != $("body").data("user-agent") && this.execute(a, b)
        },
        execute: function (a, b) {
            if (a) {
                var c = document.createElement("iframe");
                c.style.display = "none";
                var d, e = document.body, f = function (a, d) {
                    "function" == typeof b && b(!d), window.removeEventListener("pagehide", g, !0), window.removeEventListener("pageshow", g, !0), c && (c.onload = null, e.removeChild(c), c = null)
                }, g = function (a) {
                    clearTimeout(d), f(a, !1)
                };
                window.addEventListener("pagehide", g, !0), window.addEventListener("pageshow", g, !0), c.onload = f, c.src = a, e.appendChild(c);
                var h = +new Date;
                d = setTimeout(function () {
                    d = setTimeout(function () {
                        var a = +new Date;
                        h - a > 1300 ? f(null, !1) : f(null, !0)
                    }, 1200)
                }, 60)
            }
        }
    }
}, window.BT = window.BT || {}, BT.Topbanner = {
    init: function (a) {
        function b(b) {
            c.on("click", function (c) {
                c.preventDefault(), 1 == b ? (_hmt.push(["_trackEvent", "NEW HTML5 banner", "click", "NEW HTML5 banner 微信里点击量-安装了app-" + i + "-" + a.pageType]), BT.OpenApp.wx.launchApp(k, function (b) {
                    _hmt.push(b ? ["_trackEvent", "NEW HTML5 banner", "click", "NEW HTML5 banner 微信里调起app-成功-" + i + "-" + a.pageType] : ["_trackEvent", "NEW HTML5 banner", "click", "NEW HTML5 banner 微信里调起app-失败-" + i + "-" + a.pageType])
                })) : 2 == b ? (_hmt.push(["_trackEvent", "NEW HTML5 banner", "click", "NEW HTML5 banner 微信里点击量-没安装app-" + i + "-" + a.pageType]), window.location.href = j) : 0 == b && (_hmt.push(["_trackEvent", "NEW HTML5 banner", "click", "NEW HTML5 banner 微信外点击量-" + i + "-" + a.pageType]), BT.OpenApp.other.launchApp(k.url, function (a) {
                    a || (window.location.href = j)
                }))
            })
        }

        var c = $(".m-topbanner"), d = c.find(".topbanner-icon-text"), e = c.find(".topbanner-icon-button"), f = c.find(".topbanner-icon-close"), g = navigator.userAgent.toLowerCase(), h = g.match(/(ipad|iphone|ipod)/g) ? !0 : !1, i = h ? "ios" : "android", j = "/download/?type=" + i + "&src=mobile", k = BT.OpenApp.parseUrl(a);
        BT.OpenApp.isInWx() ? BT.OpenApp.wx.isAppInstalled(function (c) {
            c ? (d.addClass("topbanner-icon-text1"), e.text("打开应用"), b(1), _hmt.push(["_trackEvent", "NEW HTML5 banner", "view", "NEW HTML5 banner 微信里展示量-安装了app-" + i + "-" + a.pageType])) : (d.addClass("topbanner-icon-text2"), e.text("立即下载"), b(2), _hmt.push(["_trackEvent", "NEW HTML5 banner", "view", "NEW HTML5 banner 微信里展示量-没安装app-" + i + "-" + a.pageType]))
        }) : (d.addClass("topbanner-icon-text3"), e.text("立即开启"), b(0), _hmt.push(["_trackEvent", "NEW HTML5 banner", "view", "NEW HTML5 banner 微信外展示量-" + i + "-" + a.pageType])), f.on("click", function (a) {
            c.hide(), a.stopPropagation()
        })
    }
};

WeixinJSBridge.invoke("getInstallState",
    {
        packageName: "com.tencent.WBlog",
        packageUrl: "TencentWeibo://"
    }, function (e) {
        var n = e.err_msg;
        if (n.indexOf("get_install_state:yes") > -1) {
            alert("已经安装");
        }
    }
);