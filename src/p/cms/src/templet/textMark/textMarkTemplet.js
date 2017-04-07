var tmDefault = require('./textMark.default.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var textMarkTemplet = {
	'default': Vue.extend({
		mixins: [tmDefault],
	}),
	'scroll': Vue.extend({
		mixins: [tmDefault],
	})
}
tcMgr.register('textMarkTemplet', function(data, templetList) {
	data = Transformer.transHrefs(data)
	templetList.push({
		component: textMarkTemplet.default,
		data: data
	})
})