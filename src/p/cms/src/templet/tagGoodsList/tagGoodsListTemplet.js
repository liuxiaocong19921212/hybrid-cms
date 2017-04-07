var singleList = require('./tagGoodsList.scroll.single.vue')
var doubleList = require('./tagGoodsList.scroll.double.vue')
var Transformer = require('../../utils/dataTransformer.js')
var tcMgr = require('../../utils/templetCodeManager.js')

var tagGoodsListTemplet = {
    'single': singleList,
    'double': doubleList
}

tcMgr.register('tagGoodsListTemplet', function(data, templetList) {
    data.tagGoodsList.forEach(function(item){
        if(item.goodsList){
            item.goodsList = Transformer.transGoods(item.goodsList, data.templetType)
        }
    })
    var templet
    if(data.prodRowNum == 1){
        templet = tagGoodsListTemplet.single
    }else if(data.prodRowNum == 2){
        templet = tagGoodsListTemplet.double
    }else {
        templet = tagGoodsListTemplet.double
    }
    templetList.push({
        component: templet,
        data: data,
        options: {
            wrapperWidth: document.body.offsetWidth
        }
    })
})
