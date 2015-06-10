
~function(undefined){
    var PreLoad=function(a,b){var c=b||{};this.source=a,this.count=0,this.total=a.length,this.onload=c.onload,this.prefix=c.prefix||"",this.init()};PreLoad.prototype.init=function(){var a=this;a.source.forEach(function(b){var c=b.substr(b.lastIndexOf(".")+1).toLowerCase(),d=a.prefix+b;switch(c){case"js":a.script.call(a,d);break;case"css":a.stylesheet.call(a,d);break;case"jpg":case"gif":case"png":case"jpeg":a.image.call(a,d)}})},PreLoad.prototype.getProgress=function(){return Math.round(this.count/this.total*100)},PreLoad.prototype.image=function(a){var b=document.createElement("img");this.load(b,a),b.src=a},PreLoad.prototype.stylesheet=function(a){var b=document.createElement("link");this.load(b,a),b.rel="stylesheet",b.type="text/css",b.href=a,document.head.appendChild(b)},PreLoad.prototype.script=function(a){var b=document.createElement("script");this.load(b,a),b.type="text/javascript",b.src=a,document.head.appendChild(b)},PreLoad.prototype.load=function(a,b){var c=this;a.onload=a.onerror=a.onabort=function(a){c.onload&&c.onload({count:++c.count,total:c.total,item:b,type:a.type})}};

    var tasks = ['js/main.js', 'images/6a9aa9d02a89c238aaf5164c2e4545b0.png', 'images/d08f3c4513ce57e9e76074c9d3227560.png', 'images/53b0c52dba76a175beeaab379b416c4d.png', 'images/d460494dd52d574ac65093a729763385.png', 'images/009cdaeb9a42160aaac7d235b805ee4b.png', 'images/6326fcb279cc9fbad79aa0634c458b35.png', 'images/1e103e3cf24ae086eb1f00c9d0fef3a9.png', 'images/4f98aeed1b0efeea26a2027330eedebd.png', 'images/a866cbbb00d0548cbd1e31b61817182d.png', 'images/5ccd86d80900ae68d9817c22c90fdd06.png', 'images/f751722c61682585c38c7f2fd257ea7a.png', 'images/562c6ec9a21e4278c6324b23963a9988.png', 'images/b051dd3537b3d0ddd078205d0f509db5.png', 'images/4aa29d65ca5883466ed2d0efe20d04eb.png', 'images/aaa0820949de967805e90e4c0b7a95df.png', 'images/f2d22a20ef43cf1f7d76c44ff3b4f388.png', 'images/63af04bcbdf28f252464e271175a0bde.png', 'images/dc103add376670cc46f3a5000815fc89.png', 'images/f4397c4a2d36ff7cb484ae129befaf10.png', 'images/5926b7ffa46ca2a2c2bf7db5e99d798e.png', 'images/926fd868a46d4a4af478b49290dbcb88.png', 'images/8e683ff329917099f77aba1b77ef7869.png']
    var $progress = document.getElementById('progress')

    function loading(load) {
        var count = load.count
        var total = load.total
        $progress.innerHTML = Math.round(100*count/total) + '%'
        if(count === total) return complete()
    }

    function next(el, fn) {
        el.className += ' scaleOut'
        setTimeout(function(){
            el.parentNode.removeChild(el)
            fn && fn()
        }, 800)
    }

    function createPages() {
        var html = document.getElementById('tmpl').innerHTML
        var $pages = document.createElement('div')
        $pages.className = 'pages'
        $pages.setAttribute('tabindex', 1)
        $pages.innerHTML = html
        $pages.focus()
        document.body.appendChild($pages)

        return new Pages($pages, {
            effect: 'default',
            direction: 'Y'
        })
    }

    function shareModal() {
        var shareLink = document.querySelectorAll('[data-share]')
        var shareTips = document.getElementById('share')
        if(!shareLink.length || !shareTips) return

        shareTips.addEventListener('click', function(e) {
            this.style.display = 'none'
        }, false)
        Array.prototype.forEach.call(shareLink, function(link){
            link.addEventListener('click', function(e){
                shareTips.style.display = 'block'
            }, false)
        }, false)
    }

    function complete() {
        var $loader = document.getElementById('loader')
        var pages = createPages()
        next($loader)
        shareModal()

        setDownloadUrl()
    }

    "document"in window&&!("classList"in document.createElement("_"))&&tasks.unshift("class_list.js")

    new PreLoad(tasks, {
        onload: loading
    })
}();
