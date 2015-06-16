function createPages() {
    /*
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
     */

    var $pages = document.getElementById('pages');
    $pages.className = 'pages'
    $pages.setAttribute('tabindex', 1);

    $pages.focus();


    var zindex=10;
    var pages=document.querySelectorAll(".page");
    var max_page=pages.length;
    var page_index=0;

    for(i=0;i<max_page;i++){
        //pages[i].style.webkitTransform="translate3d(0,1000px,0)";
    }

    pages[0].setAttribute("tab",0);
    pages[0].setAttribute("active","yes");
    pages[0].style.zIndex=zindex;

    var y;

    function show_page(page_index){
        for(i=0;i<max_page;i++){
            pages[i].removeAttribute("active");
        }
        var page=pages[page_index];
        page.setAttribute("active","yes");
        zindex++;
        page.removeAttribute("style");
        page.style.webkitTransform="translate3d(0,"+y+"px,0)";
        page.style.zIndex=zindex;
        //page.style.webkitTransitionDuration="0.7s";
        //page.style.webkitTransform="translate3d(0,0,0)";
        setTimeout(function(){
            page.style.webkitTransitionDuration="0.4s";
            page.style.webkitTransform="translate3d(0,0,0)";
        },5);
    }
    var fx;
    function page_up() {
        //console.log("uping");

        fx="up";

    }

    function page_down() {
        //console.log("downing");
        fx="down";

    }

    function page_left() {
        //console.log("lefting");
        fx="left";
    }

    function page_right() {
        //console.log("righting");
        fx="right";
    }

    function ok_fn(){
        console.log(fx);
        if(fx==="up"){
            if(page_index===0){

            }else{
                page_index--;
                y=1000;
                console.log(page_index);
                show_page(page_index);
            }

        }
        if(fx==="down"){
            if(page_index===max_page-1){

            }else{
                page_index++;
                y=-1000;
                console.log(page_index);
                show_page(page_index);
            }

        }
    }

    gun(window, page_up, page_down, page_left, page_right,ok_fn);

}

function gun(el, up_fn, down_fn, left_fn, right_fn, ok_fn) {
    console.log("gun...")


    el.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
        startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
        starty = parseInt(touchobj.clientY) // get x position of touch point relative to left edge of browser
        //statusdiv.innerHTML = 'Status: touchstart<br /> ClientX: ' + startx + 'px'
        e.preventDefault()
    }, false);

    el.addEventListener('touchmove', function (e) {
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        //statusdiv.innerHTML = 'Status: touchmove<br /> Horizontal distance traveled: ' + dist + 'px'
        var distX = parseInt(touchobj.clientX) - startx;
        var distY = parseInt(touchobj.clientY) - starty;
        if (distX > document.body.scrollWidth / 3) {
            //right
            right_fn();
        }
        if (distX < -document.body.scrollWidth / 3) {
            //left
            left_fn();
        }
        if (distY > document.body.scrollWidth / 3) {
            down_fn();
        }
        if (distY < -document.body.scrollWidth / 3) {
            up_fn();
        }
        e.preventDefault()
    }, false);

    el.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        //statusdiv.innerHTML = 'Status: touchend<br /> Resting x coordinate: ' + touchobj.clientX + 'px'
        ok_fn();
        e.preventDefault()
    }, false);
}
