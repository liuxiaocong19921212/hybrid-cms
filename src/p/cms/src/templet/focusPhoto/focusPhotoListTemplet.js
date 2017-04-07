var common = require('./focusPhoto.default.vue')
var floorPhoto = require('../floorPhoto/floorPhoto.default.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var focusPhotoListTemplet = {
    'default': common.extend({
                    data: function () {
                        return {
                            pageType: 'default'
                        }
                    }
                }),
    'cubic': common.extend({
                data: function () {
                    return {
                        pageType: 'cubic'
                    }
                }
            }),
    'block': common.extend({
                    data: function () {
                        return {
                            pageType: 'block'
                        }
                    }
                }),
    'cubicDefault': common.extend({
                data: function () {
                    return {
                        pageType: 'cubic white'
                    }
                }
            }),
}

tcMgr.register('focusPhotoListTemplet', function(data, templetList) {
    data = Transformer.transHrefs(data)
    if(data.length == 1){
        //这就是tmd一张图，用毛焦点轮播
        templetList.push({
            component: floorPhoto,
            data: data
        });
    }else{
        templetList.push({
            component: focusPhotoListTemplet.cubicDefault,
            data: data,
            options: {
                'autoPlay': true,
                'loop': true,
                'perSliders': 1,
                'pagination': true,
                'wrapperWidth': document.body.offsetWidth
            }
        })
    }
})