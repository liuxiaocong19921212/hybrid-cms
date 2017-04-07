/**
 * 公用tab标签
 * @Author: 孙智远
 * @Date: 2016-12-01 17：00
 * @Last-Modified-Date: 2016-12-01 17：00
 * @Last-Modified-By: 孙智远
 */
var commonTab = require('./commonTabTemplet.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
tcMgr.register('commonTabTagTemplet', function(data, templetList) {
	Transformer.transHrefs(data.commonTabTagBeanList);
	templetList.push({
        component: commonTab,
        data: data
    })
})