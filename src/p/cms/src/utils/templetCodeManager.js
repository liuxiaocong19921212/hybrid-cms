//创建缓存
var cache = Object.create({})
module.exports = {
	//把不同类型的templetCode的处理函数注册进来
	register: function(templetCode, callback){
		cache[templetCode] = callback
	},
	get: function(templetCode){
		return cache[templetCode]
	}
}