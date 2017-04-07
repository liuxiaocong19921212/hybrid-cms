var Single = require('./goods.single.vue')
//单列的样式统一了
//去掉singleInTagList
//@zhaoye
//@time:2016-11-09
//var SingleInTagList = require('./goods.single.inTagList.vue')
var Double = require('./goods.double.vue')
var Treble = require('./goods.treble.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var goodsTemplet = {
    'single' : Single,
//单列的样式统一了
//去掉singleInTagList
//@zhaoye
//@time:2016-11-09
//    'singleInTagList': SingleInTagList,
    'double': Double,
    'treble': Treble,

}
tcMgr.register('goodsTemplet', function(data, templetList) {
    data.goodsList = Transformer.transGoods(data.goodsList, data.templetType, data.templetId)
    if(data.prodRowNum == 1){
        templetList.push({
            'component': goodsTemplet.single,
            'data': data,
            options: {
                wrapperWidth: document.body.offsetWidth
            }
        });
    }else if(data.prodRowNum ==  2){
        templetList.push({
            component: goodsTemplet.double,
            data: data,
            options: {
                wrapperWidth: document.body.offsetWidth
            }
        });
    }else if(data.prodRowNum ==  3){
        templetList.push({
            component: goodsTemplet.treble,
            data: data,
            options: {
                wrapperWidth: document.body.offsetWidth
            }
        });
    }
})

module.exports = goodsTemplet
