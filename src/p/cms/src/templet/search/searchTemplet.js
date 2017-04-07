var search = require('./searchTemplet.vue')
var tcMgr = require('../../utils/templetCodeManager.js')

tcMgr.register('searchTemplet', function(data, templetList) {
	templetList.push({
        component: search,
        data: data
    })
})