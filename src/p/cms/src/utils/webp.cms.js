var Transformer = require('./dataTransformer.js')
require('../templet/bigSmall/bigSmallTemplet.js')
require('../templet/dailyGoods/dailyGoodsTemplet.js')
require('../templet/floorPhoto/floorPhotoTemplet.js')
require('../templet/focusPhoto/focusPhotoListTemplet.js')
require('../templet/tagGoodsList/tagGoodsListTemplet.js')
require('../templet/goods/goodsTemplet.js')
require('../templet/tagCouponList/tagCouponListTemplet.js')
require('../templet/goodsCarousel/goodsCarouselTemplet.js')
require('../templet/textMark/textMarkTemplet.js')
require('../templet/custom/customTemplet.js')
require('../templet/bottomNav/bottomNav.js')
require('../templet/shortcut/shortcutTemplet.js')
require('../templet/search/searchTemplet.js')
require('../templet/carouselCoupon/carouselCouponTemplet.js')
require('../templet/classify/classifyTemplet.js')
require('../templet/shopSingleProduct/shopSingleProductTemplet.js')
require('../templet/game/gameTemplet.js')
require('../templet/commonTab/commonTabTemplet.js')

var tcMgr = require('./templetCodeManager.js')
var Cms = function() {
    this.templetList = [];
}
Cms.prototype._transfer = function() {

}
Cms.prototype.parse = function(data) {
    let templetList = data.templetList;
    templetList.forEach(function(templet) {
        //cms后台数据结构的坑，新老数据结构差别太大，暂时先这么处理
        //@zhaoye-ds1
        //@time: 2016-11-09
        if(templet.templetCode == 'tagCouponListTemplet' && templet.tagCouponTemplet){
            let temp = templet
            templet = templet.tagCouponTemplet
            templet.tagCouponListTemplet = templet.tagCouponList
            delete templet.tagCouponList
            templet.templetCode = temp.templetCode
            templet.templetId = temp.templetId
            templet.templetVerson = temp.templetVerson
        }
        if(templet.templetCode == 'textMarkTemplet' && templet.textMarkTemplet){
            let temp = templet
            templet = templet.textMarkTemplet
            templet.textMarkTemplet = templet.textMarkList
            delete templet.textMarkList
            templet.templetCode = temp.templetCode
            templet.templetId = temp.templetId
            templet.templetVerson = temp.templetVerson
        }
        let data = Transformer.transInfo(templet)
        if (!data) return true
        let handler = tcMgr.get(templet.templetCode)
        if (handler) {
            handler(data, this.templetList)
        }
    }.bind(this))
}
module.exports = new Cms;
