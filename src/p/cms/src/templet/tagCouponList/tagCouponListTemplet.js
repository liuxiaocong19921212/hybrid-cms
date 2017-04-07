var scroll = require('./tagCouponList.scroll.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var tagCouponListTemplet = {
    'default': Vue.extend({
        mixins: [scroll],
        data: function() {
            return {
                scroll: true
            }
        }
    }),
    'scroll': Vue.extend({
        mixins: [scroll],
        data: function() {
            return {
                scroll: true
            }
        }
    })
}

tcMgr.register('tagCouponListTemplet', function(data, templetList) {
    //data = data.tagCouponTemplet
    data.forEach(function(tag) {
        if (tag.couponList)
            tag.doubleList = Transformer.li2Dli(tag.couponList);
    })
    templetList.push({
        component: tagCouponListTemplet.default,
        data: data,
        options: {
            wrapperWidth: document.body.offsetWidth
        }
    })
})
