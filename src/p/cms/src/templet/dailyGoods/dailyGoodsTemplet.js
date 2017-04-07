var common = require('./dailyGoods.default.vue')
var double = require('./dailyGoods.double.vue')
var rushbuy = require('./dailyGoods.rushbuy.vue')
var free = require('./dailyGoods.free.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var dailyGoodsTemplet = {
    'common': {
        'default': common.extend({
            data: function(){
                return {
                    pageType: 'red block'
                }
            }
        }),
        'nopage': common.extend({
            data: function(){
                return {
                    pageType: false
                }
            }
        })
    },
    'double': {
        'default': double.extend({
            data: function(){
                return {
                    pageType: 'red block'
                }
            }
        }),
        'nopage': double.extend({
            data: function(){
                return {
                    pageType: false
                }
            }
        })
    },
    'free': free,
    'rushbuy': rushbuy
}

tcMgr.register('dailyGoodsTemplet', function(data, templetList) {
    data.goodsList = Transformer.transGoods(data.goodsList, data.templetType, data.templetId)
    var component = "";
    if(data.countDown == 'Y'){
        component = rushbuy
    }else if(data.prodRowNum == 2){
        component = data.goodsList.length <= 2  ? dailyGoodsTemplet.double.nopage : dailyGoodsTemplet.double.default
    }else if(data.prodRowNum == 0){
        component = dailyGoodsTemplet.free
    }else{
        //if(data.prodRowNum == 0){
        //    data.prodRowNum = 3
        //}
        //component = dailyGoodsTemplet.free
        component = data.goodsList.length <= 3  ? dailyGoodsTemplet.common.nopage : dailyGoodsTemplet.common.default
    }
    templetList.push({
        component: component,
        data: data,
        options: {
            'autoPlay': false,
            'loop': false,
            'perSliders': data.prodRowNum,
            'pagination': true,
            'wrapperWidth': document.body.offsetWidth
        }
    });
})
