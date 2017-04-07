var common = require('./floorPhoto.default.vue')
// var len4 = require('./floorPhoto.len4.vue')
// var len5 = require('./floorPhoto.len5.vue')
var len6 = require('./floorPhoto.len6.vue')
var len8 = require('./floorPhoto.len8.vue')
var tcMgr = require('../../utils/templetCodeManager.js')
var Transformer = require('../../utils/dataTransformer.js')

var floorPhotoTemplet = {
    'col1' : common,
    'col2' : common.extend({
        data: function(){
            return {
                colLength: 2
            }
        }
    }),
    'col3' : common.extend({
        data: function(){
            return {
                colLength: 3
            }
        }
    }),
    'col4' : common.extend({
        data: function(){
            return {
                colLength: 4
            }
        }
    }),
    'col5' : common.extend({
        data: function(){
            return {
                colLength: 5
            }
        }
    }),
    'col6' : len6,
    'col8' : len8
}

tcMgr.register('floorPhotoTemplet', function(data, templetList) {
    data.imgList = Transformer.transHrefs(data.imgList)
    var component;
    switch (data.imgRowNum){
        case 1:
            component = floorPhotoTemplet.col1;
        break;
        case 2:
            component = floorPhotoTemplet.col2;
        break;
        case 3:
            component = floorPhotoTemplet.col3;
        break;
        case 4:
            component = floorPhotoTemplet.col4;
        break;
        case 5:
            component = floorPhotoTemplet.col5;
        break;
        case 6:
            component = floorPhotoTemplet.col6;
        break;
        case 8:
            component = floorPhotoTemplet.col8;
        break;
    }
    templetList.push({
        component: component,
        data: data
    });
})