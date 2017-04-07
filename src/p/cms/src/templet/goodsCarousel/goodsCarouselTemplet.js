var common = require('./goodsCarousel.default.vue')
var scroll = require('./goodsCarousel.scroll.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var goodsCarouselTemplet = {
    'default': common,
    'scroll': scroll,
}

tcMgr.register('goodsCarouselTemplet', function(data, templetList) {
    data.goodsList = Transformer.transGoods(data.goodsList)
    if(data.goodsList.length == 1){
        //这就是tmd一张图，用毛焦点轮播
        templetList.push({
            component: goodsCarouselTemplet.default,
            data: data
        });
    }else{
        templetList.push({
            component: goodsCarouselTemplet.scroll,
            data: data,
            options: {
                'autoPlay': false,
                'loop': false,
                'perSliders': 1,
                'pagination': true,
                'wrapperWidth': document.body.offsetWidth
            }
        })
    }
})