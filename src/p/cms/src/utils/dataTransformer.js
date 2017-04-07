var Config = require('components').Config
var transformer = {};
var templetIdHref = [];
var templetTop = [];
var idx = 0;

var hybridProtocal = $g.env.gomeplus ? "gplus:" : "gome:"

transformer.transInfo = function(templet){
    templetIdHref.push(templet.templetId);
    if(templet.templetCode == 'customTemplet'){
        var data = templet.coustomTemplet
    }else if(templet.templetCode == 'commonTabTagTemplet'){
        templetTop.push(idx)
        var data = templet.commonTabTemplet;
    }else{
        if(templet.templetCode == 'tagGoodsListTemplet'){
            templetTop.push(idx);
        };
        var data = templet[templet.templetCode]
    }
    for(var key in templet){
        if(key != templet.templetCode && key != 'coustomTemplet' && data)
            data[key] = templet[key]
    }
    idx ++;
    return data
}
transformer._li2li = function(list,number){
        var newList = []
        var cnt = -1
        list.forEach(function(item,idx){
            if(idx%number == 0){
                cnt++
                newList[cnt] = []
                newList[cnt].push(item)
            }else{
                newList[cnt].push(item)
        }
    })
    return newList;
}
/*
 * 模板滚动位置    
 * 用于在页面内根据模板id进行跳转
 * scrollPosition 滚动到第 i 个模板
 */
transformer.templetScrollPosition= function(data){
    data.forEach(function(item){
        if(item.moduleId){
            for(var i = 0;i<templetIdHref.length;i++){
                if(templetIdHref[i] == item.moduleId){
                    item.scrollPosition = i;
                };
            }
        };
    });
    data.templetTop = templetTop;
}
transformer.li2Dli = function(list){
    return transformer._li2li(list,2);
}
transformer.adapter = {}
transformer.adapter.request = function(url) {
    var type = 'GET';
    if(/(.*)\?.*body=(\{.*\})/.test(url)){
        url = RegExp.$1
        var paramStr = decodeURI(RegExp.$2)
        var param = JSON.parse(paramStr)
        type = 'POST'
    }
    return {'url':transformer.transEnv(url),'param':param,'type': type}
}
transformer.adapter.autoSwitchHost = function(url) {
    if($g.env.gome){
        url = url.replace(/(gome|uat)plus\.com/, (/gome\.com/.test(window.location.host) ? 'gome.com.cn' : 'atguat.com.cn') )
    }else{
        url = url.replace(/gome\.com\.cn|atguat\.com\.cn/, (/gomeplus\.com/.test(window.location.host) ? 'gomeplus.com' : 'uatplus.com'))
        //神TM给uat容错
        url = url.replace('prom.uatplus.com','prom.m.uatplus.com');
        url = url.replace('prom.atguat.com.cn','prom.m.atguat.com.cn');
    }
    return url;
}
transformer.transLink = transformer.transGoodsHref = function(goodsType,goodsNo,skuId,preSale) {
    var link = ''
    switch (goodsType) {
        case 0:
        case 28:
        default:
        //普通
            if(Config.platform.wap){
                //版本回退到30了，很难搞，gome的不兼容了
                // if(!!Config.system.gome && window.appVersion < 60){
                //     link = Config.host.wap.m
                //             + '/product_details.html?sId=' + skuId
                //             +'&No=' + goodsNo 
                //             + '&skipType=' + (!!preSale ? 5 : 2) + '&wxhdid=' + window.keyProms
                // }else{
                    link = Config.host.wap.item + '/product-' + goodsNo + '-' + skuId + '.html' + '?wxhdid=' + window.keyProms
                //}
            }else{
                link = hybridProtocal + '//h5.pt.product.detail?goodsNo='+goodsNo+'&skuId='+skuId
                if(preSale){
                    link = hybridProtocal + '//h5.pt.product.detail?goodsNo='+goodsNo+'&skuId='+skuId+'&isPresell=true'
                }
            }
            break;
        case 1:
        //抢购
        //历史原因，skuId 和 goodsNo 是反的
            if(Config.platform.wap){
                //版本回退到30了，很难搞，gome的不兼容了
                // if(!!Config.system.gome && window.appVersion < 60){
                //     link = Config.host.wap.m + '/buy_area_detail.html?rushBuyItemId=' + goodsNo + '&No=' + skuId + '&skipType=2&wxhdid=' + window.keyProms 
                // }else{
                    link = Config.host.wap.q + '/rushbuy_detail-'+ goodsNo +'.html' + '?wxhdid=' + window.keyProms
                //}
            }else{
               link = hybridProtocal + '//h5.limitbuy.product.detail?rushBuyId='+goodsNo
            }
            break;
        case 2:
        //团购
            if(Config.platform.wap){
                //版本回退到30了，很难搞，gome的不兼容了
                // if(!!Config.system.gome && window.appVersion < 60){
                //     link = Config.host.wap.m + '/group_buy_detail.html?salePromoItemId=' + goodsNo + '&No=' + skuId + '&skipType=2&wxhdid=' + window.keyProms
                // }else{
                    link = Config.host.wap.tuan + '/groupon_detail-' + goodsNo + '.html' + '?wxhdid=' + window.keyProms
                //}
            }else{
               link = hybridProtocal + '//h5.groupbuy.product.detail?salePromoItemId='+goodsNo
            }
            break;
        //拼团
        case 4:
            link = Config.host.wap.pt+'/detail.html?scheme_id='+goodsNo + '&wxhdid=' + window.keyProms
            break;
    }
    return link
}
transformer.transSchemeHref = function(id,type,channel){
    if(!!Config.platform.app){
        if(type && !channel)
            return type == 'home' ? hybridProtocal + '//'+id+'.home' : hybridProtocal + '//'+id+'.'+type+'.home'
        else if(type && channel){
            if(type == 'merchant')
                return hybridProtocal + '//'+id+'.'+type+'.home?merchantId='+channel
            else
                return hybridProtocal + '//'+id+'.'+type+'.home?type='+channel
        }
        else
            return false
    }else if(!!Config.platform.wap){
    }
}
transformer.transCustomTempletLink = function(link) {
    return link
}
transformer.transHrefs = function(list){
    list.forEach(function(item){
        item.href = transformer.transHref(item)
    })
    return list;
}
transformer.transHref = function(item){
    if(!!components.Config.platform.wap){
        if(item.threeCategoryId){
            return item.threeCategoryId ? transformer.transEnv($g.env.gomeplus ? 'http://m.gomeplus.com' : 'http://m.gome.com.cn')+'/category-'+item.threeCategoryId+'.html' : 'javascript:;'
        }else{
            return item.promsUrl || item.scheme || 'javascript:;';
        }
    }
    if(typeof item.plugId != 'undefined'){
        return hybridProtocal + '//h5.global?id=cms&version=0.1&keyProms='+item.plugId.replace(/_[\s\S]*$/,'')
    }else{
        if(typeof item.promsUrl != 'undefined'){
            return item.promsUrl
        }else if(item.threeCategoryId){
            return item.threeCategoryId ? transformer.transEnv($g.env.gomeplus ? 'http://m.gomeplus.com' : 'http://m.gome.com.cn')+'/category-'+item.threeCategoryId+'.html' : 'javascript:;'
        }else if(item.scheme){
            return item.scheme
        }else{
            return item.keyProms ? transformer.transEnv($g.env.gomeplus ? 'http://m.gomeplus.com' : 'http://m.gome.com.cn')+'/digital-'+item.keyProms+'.html' : 'javascript:;'
        }
    }
}
    transformer.transBigDataGoods = function(data){
        var list = data.lst[0].lst.map(function(item){
            return {
                goodsType: 0,
                goodsBean: {
                    skuThumbImgUrl: item.iurl,
                    imageUrl: item.iurl,
                    href: item.purl,
                    scheme: item.purl,
                    productID: item.pid,
                    goodsNo: item.pid,
                    skuID: item.sid,
                    skuId: item.sid,
                    skuName: item.pn,
                    priceBean: {
                        skuPrice: item.price,
                        goodsType: 0,
                        skuThumbImgUrl: item.iurl,
                        imageUrl: item.iurl,
                        href: item.purl,
                        scheme: item.purl,
                        productID: item.pid,
                        goodsNo: item.pid,
                        skuID: item.sid,
                        skuId: item.sid,
                        skuName: item.pn,
                    }
                },
                origin: item
            }
        })
        return {
            goodsList: transformer.transGoods(list)
        }
    }
/**
 * 商品数据转换器
 * @param  {Array} _list    商品列表
 * @param  {int} listType   商品类型，0：普通，8：礼物购
 * @return {Array}          转换之后的商品列表
 */
transformer.transGoods = function(_list, listType, templetId){
    if(!_list){
        return false;
    }
    var list = _list.filter(function(){return true})
    list.forEach(function (item) {
        var transformed = item.transformed = {};
        transformed.priceData = {};
        transformed.imageUrl = item.goodsBean.skuThumbImgUrl;
        transformed.isBBC = item.isBBC;
        transformed.goodsType = parseInt(item.goodsType);
        transformed.start = 0;
        transformed.end = 0;
        transformed.name = item.goodsBean.skuName;
        transformed.productType = 'normal'
        transformed.state = 1
        transformed.productState = ''
        transformed.tipInfo = ''
        transformed.skuId = '';
        transformed.goodsNo = '';
        transformed.vipPrice = '';
        transformed.vipPriceTitle='';
            transformed.promoWord='';
            if(item.shortWord){
                transformed.shortWord = item.shortWord;
            }
            if(item.promoWord){
                transformed.promoWord = item.promoWord;
            }
        if(item.goodsBean.skuID){
            transformed.skuId = item.goodsBean.skuID;
        }
        if(item.goodsBean.productID){
            transformed.goodsNo = item.goodsBean.productID;
        }
        if(item.goodsBean.priceBean){
            transformed.price = item.goodsBean.priceBean.skuPrice
                                || item.goodsBean.priceBean.skuRushBuyPrice
                                || item.goodsBean.priceBean.skuGrouponBuyPrice
                                || (item.goodsBean.priceBean.preSellInfo ? item.goodsBean.priceBean.preSellInfo.prePrice : '')
                                || (item.goodsBean.priceBean.reserveInfo ? item.goodsBean.priceBean.reserveInfo.reservePrice : '')
                                || (item.goodsBean.priceBean.groupPrice ? item.goodsBean.priceBean.groupPrice : '')
                                || (item.goodsBean.priceBean.zerobuyInfo ? item.goodsBean.priceBean.zerobuyInfo.zerobuyPriceDesc : '')
            transformed.originPrice = item.goodsBean.priceBean.skuOriginalPrice ? item.goodsBean.priceBean.skuOriginalPrice : null
            switch (transformed.goodsType){
                case 0:
                case 28:
                    //礼物购
                    transformed.productState = '立即购买';
                    if(listType == 8){
                        transformed.href =  Config.host.wap.m + '/gift_product-'+item.goodsBean.priceBean.goodsNo+'-'+item.goodsBean.priceBean.skuId+'-'+window.keyProms+'_'+templetId+'.html'

                    }else{
                        //vipPrice 会员价
                        if(item.goodsBean.priceBean.memPriceInfo){
                            transformed.productType  = transformed.tagType = 'vip'
                            transformed.tagContent = '会员专享'
                            if(item.goodsBean.priceBean.memPriceInfo){
                                var vipPriceFix = item.goodsBean.priceBean.memPriceInfo.memPrice;
                                if(vipPriceFix.toString().split(".")[1] && vipPriceFix.toString().split(".")[1].length>=2){
                                    //console.log('大于2位小数');
                                    transformed.price = parseFloat(vipPriceFix).toFixed(2) || transformed.price;
                                }else{
                                    //console.log('整数或者小于2位小数');
                                    transformed.price = vipPriceFix || transformed.price;
                                };
                                
                            }
                            transformed.vipPriceTitle = item.goodsBean.priceBean.memPriceInfo.memPriceTitle
                        }
                        transformed.href = transformer.transLink(transformed.goodsType, item.goodsBean.priceBean.goodsNo, item.goodsBean.priceBean.skuId)
                        switch (parseInt(item.goodsBean.priceBean.skuPriceType)){
                            case 1:
                                transformed.priceType = '掌上专享'
                                transformed.tagContent = '掌上专享'
                                transformed.productType  = transformed.tagType = 'exclusive'
                                if(item.goodsBean.priceBean.skuSalePrice){
                                    transformed.originPrice = item.goodsBean.priceBean.skuSalePrice
                                }
                                break;
                            case 5:
                                transformed.productState = '去预定'
                                transformed.priceType = '预售'
                                transformed.tagContent = '预售'
                                transformed.productType  = transformed.tagType = 'presell'
                                transformed.href = transformer.transLink(transformed.goodsType, item.goodsBean.priceBean.goodsNo, item.goodsBean.priceBean.skuId, true)
                                    transformed.tipInfo = item.goodsBean.priceBean.preSellInfo.deposit
                                break;
                            case 4:
                                transformed.priceType = '预约'
                                transformed.tagContent = '预约'
                                if(item.goodsBean.priceBean.reserveInfo)
                                    transformed.price = item.goodsBean.priceBean.reserveInfo.reservePriceDesc || transformed.price
                                transformed.productType  = transformed.tagType = 'reserve'
                                break;
                        }
                        //返利
                        if(item.goodsBean.rebatePriceDesc && parseInt(item.goodsBean.priceBean.skuPriceType) != 1){
                            //掌上专享商品不返回 返利商品信息，优先展示掌上专享的描述语
                            transformed.rebatePriceDesc = item.goodsBean.rebatePriceDesc;
                            transformed.tagContent = '返利';
                        }
                    }
                    if(transformed.goodsType == 28){
                        transformed.priceType = '海外购'
                        transformed.tagContent = '海外购'
                        transformed.productType  = transformed.tagType = 'overseas'
                    }
                    break;
                case 1:
                    transformed.priceType = '抢购'
                    transformed.tagContent ='抢购'
                    transformed.productType  = transformed.tagType = 'rushbuy'
                    transformed.href = transformer.transLink(transformed.goodsType, item.goodsBean.priceBean.rushBuyItemId, transformed.goodsNo)
                    transformed.state = Number(item.goodsBean.priceBean.rushBuyState);
                    transformed.tipInfo = item.goodsBean.priceBean.remainNum

                    switch (transformed.state) {
                        case 0:
                            transformed.productState = '未开始'
                            if(item.goodsBean.priceBean.startDate){
                                transformed.startDate = item.goodsBean.priceBean.startDate;
                            }
                            break;
                        case 1:
                            transformed.start = item.goodsBean.priceBean.startDate;//new Date().getTime() - 10000
                            transformed.end = item.goodsBean.priceBean.endDate;//new Date().getTime() + 10000
                            transformed.productState = '马上抢'
                            transformed.delayTime = -666;
                            break;
                        case 2:
                            transformed.productState = '已抢光'
                            break;
                        case 3:
                            transformed.productState = '已结束'
                            break;
                        default:
                            transformed.state = 0
                            break;
                    }
                    break;
                case 2:
                    transformed.priceType = '团购'
                    transformed.tagContent = '团购'
                    transformed.productType  = transformed.tagType = 'groupon'
                    transformed.href = transformer.transLink(transformed.goodsType, item.goodsBean.priceBean.salePromoItemId, transformed.goodsNo)
                    transformed.state = Number(item.goodsBean.priceBean.saleState)
                    transformed.tipInfo = item.goodsBean.priceBean.boughtNum
                    switch (transformed.state) {
                        case 0:
                            transformed.productState = '未开始'
                            if(item.goodsBean.priceBean.startDate){
                                transformed.startDate = item.goodsBean.priceBean.startDate;
                            }
                            break;
                        case 1:
                            transformed.productState = '去参团'
                            transformed.delayTime = -666;
                            transformed.start = item.goodsBean.priceBean.startDate;//new Date().getTime() - 10000//
                            transformed.end =  item.goodsBean.priceBean.endDate;//new Date().getTime() + 10000//
                            break;
                        case 2:
                            transformed.productState = '已抢光'
                            break;
                        case 3:
                            transformed.productState = '已结束'
                            break;
                        default:
                            transformed.state = 0
                            break;
                    }
                    break;
                case 4:
                    transformed.productState = '立即购买'
                    transformed.priceType = '拼团'
                    transformed.tagContent = '拼团'
                    transformed.productType = transformed.tagType = 'pintuan'
                    if(window.appVersion >= 66 || Config.platform.wap)
                        transformed.href = Config.host.wap.pt + '/detail.html?scheme_id=' + item.itemId
                    else
                        transformed.href = 'javascript:;'
                    break;
                case 5:
                    transformed.productState = '存钱白拿'
                    transformed.priceType = '白拿'
                    transformed.tagContent ='白拿'
                    transformed.productType  = transformed.tagType = 'nomoney'
                    transformed.href = item.scheme
                    transformed.price += ' 存'+item.goodsBean.priceBean.zerobuyInfo.investPeriodDesc
                    transformed.tipMonth = item.goodsBean.priceBean.zerobuyInfo.investPeriodDesc   //存储月份
                    transformed.tipInfo = item.goodsBean.priceBean.zerobuyInfo.bankRateDesc        //利率
                    transformed.rate = item.goodsBean.priceBean.zerobuyInfo.bankRate        //利率
                break;
            }
            if(Number(transformed.originPrice) - Number(transformed.price) > 0){
                transformed.discountPrice = String(Number(transformed.originPrice) - Number(transformed.price));
                transformed.discountPrice = /\.[0-9]{1,3}(.*)/.test(transformed.discountPrice) ? transformed.discountPrice.replace(RegExp.$1,'') : transformed.discountPrice;
                transformed.discountPrice = String(Number(transformed.discountPrice).toFixed(2));
            }else {
                transformed.discountPrice = 0;
            }
            if(Number(transformed.originPrice) - Number(transformed.price) <= 0.009){
                transformed.originPrice = null
            }
            //原价已取消 2016-08-09 @zhaoye-ds1
            //为了凸显会员价商品优惠价格，会员商品增加原价显示 2016-01-09 @sunzhiyuan
            if(!item.goodsBean.priceBean.memPriceInfo){
                transformed.originPrice = null
            }
        }
    })
    return list;
    }
    transformer.setEnv =function(env){
        ENV = env
    }
transformer.transEnv = function(url){
    //https的处理
    if(!$g.env.hybrid){
        url = url.replace(/http[s]?:\/\//,'//')
    }else{
        var version = 0;
        // if($g.system.android && navigator.userAgent.match(/gome/))
        //     version = navigator.userAgent.match(/gome\/(\d*)/)[1];
        // else if($g.system.ios  && navigator.userAgent.match(/gome/) )
        //     version = navigator.userAgent.match(/gome\/iphone\/(\d*)\//) ? navigator.userAgent.match(/gome\/iphone\/(\d*)\//)[1] : 0;
        // if($g.system.ios && version >= 75)
        //     url = url.replace(/http[s]?:\/\//,'https://')
        if(navigator.userAgent.match(/gomeplus/)){
            if(navigator.userAgent.match(/iphone/) && $g.env.live){
                 version = navigator.userAgent.match(/gomeplus\/iphone\/(\d*)/)[1]
                url = url.replace(/http[s]?:\/\//,'https://')
            }
        }else if(!navigator.userAgent.match(/gomeplus/) && navigator.userAgent.match(/gome/)){
            if(navigator.userAgent.match(/iphone/)){
                version = navigator.userAgent.match(/gome\/iphone\/(\d*)/)[1]
                if(version >= 75){
                    url = url.replace(/http[s]?:\/\//,'https://')
                }
            }
        }
    }
    if(!$g.env.hybrid){
        url.replace(/prom.mobile.gome.com.cn\/mobile/,'prom.mobile.gome.com.cn\/wap').replace(/prom-mobile.gomeplus.com\/mobile/,'prom-mobile.gomeplus.com\/wap')
    }
    if(Config.env.uat){
        return url
                .replace(/\/\/prom\.mobile\.gome\.com\.cn/,'\/\/prom.mobile.atguat.com.cn')
                .replace(/\/\/prom-mobile\.gomeplus\.com/,'\/\/prom.mobile.uatplus.com')
                .replace(/img\.gomein\.net\.cn/,'js.atguat.com.cn')
                .replace(/\/\/prom\.m\.gome\.com\.cn/,'\/\/prom.mobile.atguat.com.cn')
                .replace(/\/\/prom\.m\.gomeplus\.com/,'\/\/prom.mobile.uatplus.com')
                .replace(/\/\/m\.gome\.com\.cn/,'\/\/m.atguat.com.cn')
                .replace(/\/\/m\.gomeplus\.com/,'\/\/m.uatplus.com')
                .replace(/mobile\.gome\.com\.cn/,'mobile.atguat.com.cn')
                .replace(/mobile\.gomeplus\.com/,'mobile.uatplus.com')
                .replace(/\.gome\.com\.cn/,'\.atguat.com.cn')
                .replace(/\.gomeplus\.com/,'\.uatplus.com')
    }
    else if(Config.env.pro)
        return url
    else if(Config.env.pre)
        return url.replace(/\/\/prom.mobile.gome.com.cn/,'\/\/prom.mobile.gomeprelive.com.cn').replace(/\/\/prom.m.gome.com.cn/,'\/\/prom.mobile.gomeprelive.com.cn').replace(/\/\/m.gome.com.cn/,'\/\/m.gomeprelive.com.cn')
    else if(Config.env.sit)
        return url.replace(/\/\/prom.mobile.gome.com.cn/,'\/\/10.58.50.98:3502').replace(/\/\/prom.m.gome.com.cn/,'\/\/10.58.50.98:3502').replace(/\/\/m.gome.com.cn/,'\/\/m.gome.com.cn')
    else {
        return url
    }
}
module.exports = transformer;
