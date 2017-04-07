var shortcutTemplet = require('./shortcut.default.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

tcMgr.register('tagShortcutTemplet', function(data, templetList){
    data.shortcutList = Transformer.transHrefs(data.shortcutList)

    templetList.push({
        component: shortcutTemplet,
        data: data,
        options:{
            
        }
    })
})
