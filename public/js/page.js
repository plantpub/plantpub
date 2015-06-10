var Pages = function(el, options) {
    this.options = this._extend({
        direction: 'Y',
        effect: 'default',
        autoplay: true,
        range: 60,
        duration: .4,
        current: 0,
        change: false,
        mouse: true,
        keyup: true
    }, options);

    this.current = this.options.current;

    this.touch     = 'ontouchend' in window;
    this.touching  = false;
    this.animating = false;
    this.flag      = false;
    this.moving    = false;

    this.pageX;
    this.pageY;

    this.transitionDuration='transitionDuration';
    this.transform='transform'

    this.$el       = (typeof el==='string')?document.getElementById(el):el
    if(!this.$el.nodeType) return false

    var dictionary = {
        'default': ['slide',  'slide'],
        'scale'  : ['slide',  'scale'],
        'fade'   : ['fade'],
        'slide'  : ['slide']
    }

    this.pages     = this.$el.children
    this.total     = this.pages.length - 1
    this.entrance  = this[dictionary[this.options.effect][0]].bind(this)
    this.exits     = (this[dictionary[this.options.effect][1]]||function(){}).bind(this)
    this.distance  = 0

    this._init();
    this._bindEvents();
    this._hook();
}

Pages.prototype._hook = function() {
    var self = this
    var hooks = this.$el.querySelectorAll('[data-gotopage]')

    Array.prototype.forEach.call(hooks, function(hook){
        var num = parseInt(hook.getAttribute('data-gotopage'))
        if(num) {
            hook.addEventListener('click', function(e){
                if(!self.animating) self.go2page(num-1)
            }, false)
        }
    })
}

Pages.prototype._init = function() {
    var width = this.$el.clientWidth
    var height = this.$el.clientHeight
    var distance = this.distance =  this.options.direction==='X'?width:height
    var current = this.current
    var pages = this.pages
    var total = this.total
    var scale = 1
    var vScale = width/360
    var hScale = height/600

    scale = vScale<hScale?vScale:hScale
    if(scale > 2) scale = 2

    while (total>=0) {
        if (current === total) {
            if(this.options.autoplay) this._play(pages[total])
        } else {
            this.clearDuration(pages[total])
            this.entrance(pages[total], total<current? -distance: distance)
        }

        pages[total].children[0].style.zoom = scale
        total--
    }

    document.body.scrollTop = 0
    !this.touch && this.$el.focus()
}

Pages.prototype._play = function(target, current) {
    this.animating = true

    setTimeout(function(){
        var $targets = target.querySelectorAll('.animate')
        var $currents = current && current.querySelectorAll('.animate')

        $targets && Array.prototype.forEach.call($targets, function($target) {
            $target.style.display = 'block'
        })
        $currents && Array.prototype.forEach.call($currents, function($current) {
            $current.style.display = 'none'
        })
        current && (current.style.zIndex = 0)
        this.animating = false
    }.bind(this), this.options.duration * 1000)
}

Pages.prototype._bindEvents = function() {
    var $el = this.$el
    var events = this.touch? [
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel'
    ]: [
        'mousewheel',
        'mousedown',
        'mousemove',
        'mouseup',
        'mousecancel',
        'keyup'
    ]

    for (var i=events.length; i>0;) {
        $el.addEventListener(events[--i], this, false)
    }

    window.addEventListener('orientationchange', this, false)
    window.addEventListener('resize', this, false)
}

Pages.prototype._extend = function(destination, source) {
    for (var property in source) destination[property] = source[property]
    return destination;
}

Pages.prototype.handleEvent = function(e) {
    var type = e.type

    switch (type) {
        case 'orientationchange':
        case 'resize':
            this._init(e)
            break
        case 'touchstart':
        case 'mousedown':
            this.start(e)
            break
        case 'touchmove':
        case 'mousemove':
            this.move(e)
            break
        case 'mousewheel':
            this.mousewheel(e)
            break
        case 'keyup':
            this.keyup(e)
            break
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mousecancel':
            this.end(e)
            break
    }
}

Pages.prototype.play = function() {
    this._play(this.$current())
}

Pages.prototype.start = function(e) {
    if(this.touching || this.animating) {
        e.preventDefault()
        e.stopPropagation()
        return
    }

    this.touching = true
    this.flag = null
    this.moving = 0

    var touches = e.type === 'touchstart'? e.touches[0]: e;
    var distance = this.distance;
    var entrance = this.entrance;

    var $current = this.$current();
    var $next = $current.nextElementSibling;
    var $prev = $current.previousElementSibling;

    this.clearDuration($current, $next, $prev);

    this.pageX = touches.pageX;
    this.pageY = touches.pageY;
    $current.style.zIndex = 1;

    if($next) {
        $next.style.zIndex = 2;
        entrance($next, distance);
    }
    if($prev) {
        $prev.style.zIndex = 2
        entrance($prev, -distance)
    }
}

Pages.prototype.$current = function() {
    return this.pages[this.current]
}

Pages.prototype.move = function(e) {
    e.preventDefault()

    if(!this.touching || this.animating) return

    var touches = e.type === 'touchmove'? e.touches[0]: e;
    var direction = this.options.direction;
    var distance = this.distance;

    var current = this.current;
    var $current = this.$current();
    var next = $current.nextElementSibling;
    var prev = $current.previousElementSibling;
    var X = touches['pageX']-this['pageX'];
    var Y = touches['pageY']-this['pageY'];
    var move = this.moving = direction==='X'?X:Y;

    if(!this.flag && Math.abs(X-Y) > 100) {
        this.flag = X>Y?'X':'Y';
    }

    next && ( this.entrance(next, move+distance) );
    prev && ( this.entrance(prev, move-distance) );

    if( (current === 0 && move>0) || (current === this.total && move<0) ) return this.slide($current, move/4)
    this.exits($current, move)
}

Pages.prototype.end = function(e) {
    var move = this.moving;
    var distance = this.distance;
    var range = this.options.range;
    var entrance = this.entrance;
    var $current = this.$current();
    var $next = $current.nextElementSibling;
    var $prev = $current.previousElementSibling;

    this.touching = false;

    if ($next && move < -range) return this.next();
    if ($prev && move >  range) return this.prev();

    this.duration($current, $next, $prev);
    this.entrance($current, 0);
    $prev && ( this.entrance($prev, -distance) )
    $next && ( this.entrance($next,  distance) )
}

Pages.prototype.slide = function(el, volume) {
    el.style['webkitTransform'] = 'translate3d('+('Y'===this.options.direction?('0,'+volume+'px'):(volume+'px,0'))+',0)'
}

Pages.prototype.fade = function(el, volume) {
    var distance = this.distance
    el.style.opacity = 1-Math.abs(volume/distance)
    el.style['webkitTransform'] = 'translate3d('+('Y'===this.options.direction?('0,'+volume+'px'):(volume+'px,0'))+',0)'
}

Pages.prototype.scale = function(el, volume) {
    el.style['webkitTransform'] = 'scale('+(1-Math.round(Math.abs(volume)/this.distance/3*100)/100)+') translateZ(0)'
}

Pages.prototype.clearDuration = function() {
    Array.prototype.forEach.call(arguments, function(el) {
        el && el.nodeType && el.style['webkitTransitionDuration'] && (el.style['webkitTransitionDuration'] = null)
    })
}

Pages.prototype.duration = function() {
    var duration = this.options.duration

    Array.prototype.forEach.call(arguments, function(el) {
        el && (el.style['webkitTransitionDuration'] = duration+'s')
    })
}

Pages.prototype.mousewheel = function(e) {
    if(this.touching || this.animating) return
    e.wheelDelta<0?this.next():this.prev()
}

Pages.prototype.keyup = function(e) {
    var code = e.keyCode
    var shif = e.shiftKey
    var ctrl = e.ctrlKey
    var alt  = e.altKey

    if(this.touching || this.animating || ctrl ||alt ) return

    if(code === 32) shif?this.prev():this.next()
    else if(code === 38 || code === 75 || code === 37) this.prev()
    else if(code === 40 || code === 74 || code === 39) this.next()
}

Pages.prototype.next = function() {
    this.go2page(this.current+1)
}

Pages.prototype.prev = function() {
    this.go2page(this.current-1)
}

Pages.prototype.random = function() {
    var count = this.$el.children.length
    var current = this.current
    var arr = []
    var num

    for(var i=0; i<count; i++) {
        if(i!==current) arr.push(i.toString())
    }

    num = Math.floor(Math.random()*arr.length)
    this.go2page(arr[num])
}

Pages.prototype.go2page = function(i) {
    if (i === this.current || i<0 || i>this.total) return this.moving = false

    var $current = this.$current()
    var $target = this.pages[i]
    var distance = (i<this.current?1:-1)*this.distance
    var action = function() {
        this.duration($current, $target)
        this.exits($current, distance)
        this.entrance($target, 0)
        this._play($target, $current)

        this.moving = false
        this.current = i
    }.bind(this)


    if (this.moving) action()
    else {
        this.clearDuration($target, $current)
        $target.style.zIndex = 2
        $current.style.zIndex = 1
        this.entrance($target, -distance)
        setTimeout(action, 24);
    }

    if ('function' === typeof this.options.change) this.options.change(i, this.current, this)
}