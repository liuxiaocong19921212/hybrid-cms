/**
 * 游戏后台的入口
 * @Author liuxiaocong
 * @Created-Date: 2016-11-4
 * @Last-Modefied-Date: 2016-11-24
 * @Last-Modefied-By: lxc
 */
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
var wheelSquare = require('./gameTemplet.wheel.square.vue')
var scrape = require('./gameTemplet.scrape.vue')
tcMgr.register('gameTemplet', function(data, templetList) {
    var component;
    if(data.gameType == 0){
        component = wheelSquare
    }else{
    	component = scrape
    }
    templetList.push({
        component: component,
        data: data
    })
})