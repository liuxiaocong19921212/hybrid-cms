/**
 * 店铺单品的入口
 * @Author zhaoye
 * @Created-Date: 2016-10-31
 * @Last-Modefied-Date: 2016-11-01
 * @Last-Modefied-By: zhaoye
 */
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
var component = require('./shopSingle.vue')


tcMgr.register('shopSingleProductTemplet', function(data, templetList) {
   templetList.push({
        component: component,
        data: data,
        options: {
            'autoPlay': false,
            'loop': false,
            'perSliders': 'auto',
            'pagination': false,
            'wrapperWidth': document.body.offsetWidth
        }
   })
})