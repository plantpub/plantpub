var zp = {
    isring: false,//正在不旋转
    count: 3,//可以抽奖的次数
    num: 0,
    r: 0,//单个角度
    this_index: 1,//当前指向的 item 序列
    items: [
        {index: 1, name: "1",info:"",state:0, rand: 1},
        {index: 2, name: "2",info:"",state:1, rand: 1},
        {index: 3, name: "3",info:"",state:1, rand: 10},
        {index: 4, name: "4",info:"",state:1, rand: 21},
        {index: 5, name: "5",info:"",state:1, rand: 3},
        {index: 6, name: "6",info:"",state:1, rand: 32},
        {index: 7, name: "7",info:"",state:1, rand: 1},
        {index: 8, name: "8",info:"",state:1, rand: 1}
    ],
    random_index: [],
    init: function (e) {
        zp.r = 360 / zp.items.length;//单个旋转角度
        zp.item_count = zp.items.length;//多少个项目

        //根据权重，把项目添加到项目池
        for (var i = 0; i < zp.item_count; i++) {
            var item = zp.items[i];
            for (var ii = 0; ii < item.rand; ii++) {
                zp.random_index.push(zp.items[i].index);
            }

        }

        zp.e = document.getElementById("zp");
        zp.e.style.webkitTransition = "all 5s";
        zp.e.addEventListener("webkitTransitionEnd", function () {
            zp.count--;
            console.log(zp.get);

            zp.isring = false;
            //取得 当前选中的项
            var this_item=zp.items.filter(function(element,pos){return element.index==zp.get})[0];
            console.dir(this_item);
            zp.this_index = zp.get; //设置当前的编号
        });
    },
    start: function () {
        if (!zp.e) {

        } else {
            if (zp.isring) {

            } else {
                if (zp.count > 0) {

                    //得到 抽中的 编号
                    zp.get = zp.random_index[Math.ceil(Math.random() * zp.random_index.length)-1];
                    console.log("当前的编号:" + zp.this_index);
                    console.log("抽中的编号:" + zp.get);
                    var r;
                    if (zp.this_index === zp.get) {
                        r = 360;
                    } else {

                        if (zp.get > zp.this_index) {
                            r = Math.abs(zp.get - zp.this_index) * zp.r;
                        }
                        if (zp.get < zp.this_index) {
                            r = Math.abs(zp.item_count - Math.abs(zp.get - zp.this_index) )* zp.r;
                        }

                    }
                    console.log("偏转角度：" + r)
                    zp.num += 360*3;
                    zp.num += r;

                    zp.e.style.webkitTransform = 'rotate(' + zp.num + 'deg)';
                    zp.isring = true;
                } else {
                    alert("抽奖机会已经耗尽");
                }
            }

        }

    }
}
window.onload = function () {
    zp.init();
    document.getElementById("btn").addEventListener("click", function () {
        zp.start();
    });
}