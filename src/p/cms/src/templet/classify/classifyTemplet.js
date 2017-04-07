/**
 * cms分类页
 * @Author: 刘晓丛
 * @Date: 2016-09-26 15:00
 * @Last-Modified-Date: 
 * @Last-Modified-By: 
 */
var classify = require('./classify.default.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
tcMgr.register('classifyTemplet',function(data, templetList){
	data.secondCategoryList.forEach(function(item){
		item.threeCategoryList ? Transformer.transHrefs(item.threeCategoryList) : 'do nothing'
	})
	templetList.push({
		component: classify,
		data: data.secondCategoryList
	})
})