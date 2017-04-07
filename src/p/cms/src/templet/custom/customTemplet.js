var tcMgr = require('../../utils/templetCodeManager.js')
var component = require('./custom.default.vue')

tcMgr.register('customTemplet', function(data, templetList) {
    templetList.push({
        component: component,
        data: data
    })
})
