var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')
var component = require('./coupon.carousel.vue')
tcMgr.register('carouselCouponTemplet', function(data, templetList) {
    templetList.push({
        component: component,
        data: data,
            originData: data,
        options: {
            'autoPlay': false,
            'loop': false,
            'perSliders': 'auto',
            'pagination': false,
            'wrapperWidth': document.body.offsetWidth
        }
    });
})
