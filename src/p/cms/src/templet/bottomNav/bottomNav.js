/**
 * cms促销页，底部导航
 * @Author: zhaoye-ds1
 * @Date: 2016-05-30 10:00
 * @Last-Modified-Date: 2016-05-30 13:21
 * @Last-Modified-By: zhaoye-ds1
 */
var BottomNav = require('./bottomNav.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
tcMgr.register('commonBottomColumnTemplet', function(data, templetList) {
    Transformer.transHrefs(data.bottomColumnList)
    data.bottomSubList ? Transformer.transHrefs(data.bottomSubList) : 'do nothing'
    templetList.push({
        component: BottomNav,
        data: data,
    })
})
