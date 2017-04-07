var LeftBig = require('./bigSmall.leftBig.vue')
var RightBig = require('./bigSmall.rightBig.vue')
var Len5LeftBig = require('./bigSmall.len5.leftBig.vue')
var Len5RightBig = require('./bigSmall.len5.rightBig.vue')
var Len4LeftBig = require('./bigSmall.len4.leftBig.vue')
var Len4RightBig = require('./bigSmall.len4.rightBig.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

tcMgr.register('bigSmallTemplet', function(data, templetList) {
    data.bigImgList ? Transformer.transHrefs(data.bigImgList) : 'do nothing';
    data.smallImgList ? Transformer.transHrefs(data.smallImgList) : 'do nothing';
    data.imgList ? Transformer.transHrefs(data.imgList) : 'do nothing';
    if (data.imgList)
        data.doubleList = Transformer.li2Dli(data.imgList);
    var component;
    if(data.seqType == 1){
        switch(data.imgNum){
            case 3:
                component = LeftBig;
                break;
            case 4:
                component = Len4LeftBig;
                break;
            case 5:
                component = Len5LeftBig;
                break;
            default:
                component = LeftBig;
                break;
        }
    }else if(data.seqType == 2){
        switch(data.imgNum){
            case 3:
                component = RightBig;
                break;
            case 4:
                component = Len4RightBig;
                break;
            case 5:
                component = Len5RightBig;
                break;
            default:
                component = RightBig;
                break;
        }
    }
    templetList.push({
        component: component,
        data: data,
        options: {

        }
    })
})