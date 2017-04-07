var cms = require('./utils/webp.cms.js');
var comps = require('components');
var Transformer = require('./utils/dataTransformer.js');
//var dofake  = require('./utils/fakePlugin.js');

function preventHref(){
    var oldParttens = {
        'productNormal': /product-(.[^-]+?)-(.[^-]+?)\.html/,
        'productGroupon': /groupon_detail-(.+?)\.html/,
        'productRushbuy': /rushbuy_detail-(.+?)\.html/,
        //金融首页 理财首页
        'jinronghome':/finance-index\.html|finance-licai\.html/,
        //p2p
        'p2phome':/licai_p2p_list-(.+?)-(.+?)\.html/,
        //固收
        'gushouhome':/licai_gs_list-(.+?)-(.+?)\.html/,
        //账单 票据
        'piaojuhome': /licai_bill_list-(.+?)-(.+?)\.html/,
        //第一个参数是资产包类型（010票据/020P2P/040固收），第二个参数是专享类型（020新手专享）
        'licaiXinshou': /licai_xinshou_list-(.+?)-(.+?)\.html/,
        'bainahome': /finance-baina\.html/,
        'zhongchouhome': /finance-crowdfund\.html/,
        'huafeihome':/recharge\.html/,
        'shop':/shop-(.+?)\.html/,
        'meiyingbao': /meiyingbao\.html/,
        'recharge': /recharge\.html/,
    }
    var oldMatch = function(pathname,parttens){
        for(var key in oldParttens){
            if(oldParttens[key].test(pathname)){
                if(key == 'productNormal'){
                    var goodsNo = pathname.match(oldParttens[key])[1]
                    var skuId = pathname.match(oldParttens[key])[2]
                    return Transformer.transGoodsHref(0,goodsNo,skuId)
                }else if(key == 'productRushbuy'){
                    var goodsNo = pathname.match(oldParttens[key])[1]
                    var skuId = pathname.match(oldParttens[key])[2]
                    return Transformer.transGoodsHref(1,goodsNo,skuId)
                }else if(key == 'productGroupon'){
                    var goodsNo = pathname.match(oldParttens[key])[1]
                    var skuId = pathname.match(oldParttens[key])[2]
                    return Transformer.transGoodsHref(2,goodsNo,skuId)
                }else if(key == 'p2phome'){
                    return Transformer.transSchemeHref('finance','p2p')
                }else if(key == 'gushouhome'){
                    return Transformer.transSchemeHref('finance','fixedincome')
                }else if(key == 'piaojuhome'){
                    return Transformer.transSchemeHref('finance','bill')
                }else if(key == 'bainahome'){
                    return Transformer.transSchemeHref('finance','baina')
                }else if(key == 'licaiXinshou'){
                    //第一个参数是资产包类型（010票据/020P2P/040固收），第二个参数是专享类型（020新手专享）
                    var id1 = pathname.match(oldParttens[key])[1]
                    var id2 = pathname.match(oldParttens[key])[2]
                    return Transformer.transSchemeHref('finance','newComer',id1)
                }else if(key == 'shop'){
                    var id = pathname.match(oldParttens[key])[1]
                    return Transformer.transSchemeHref('promotion','merchant',id)
                }else if(key == 'recharge'){
                    return Transformer.transSchemeHref('virtual','mobilecharge','010')
                }else if(key == 'jinronghome'){
                    return Transformer.transSchemeHref('finance','home')
                }else if(key == 'meiyingbao'){
                    return Transformer.transSchemeHref('finance','meiyingbao')
                }else if(key == 'zhongchouhome'){
                     return Transformer.transSchemeHref('finance','croudfunding')
                }
            }
        }
        return null
    }

    //过滤
    var parttens = [
        /index.html/,
        /product-(.+?)-(.+?)\.html/,
        /groupon_detail-(.+?)\.html/,
        /rushbuy_detail-(.+?)\.html/,
        /gift_product-(.+?)-(.+?)-(.+?)\.html/,
        /category-cat(\d+)\.html/,
        /groupon\.html/,
        /rushbuy\.html/,
        /recharge\.html/,
        /film\.html/,
        /film_detail-(.+?)\.html/,
        /my_gome\.html/,
        /my_pointschange\.html/,
        /best_gome\.html/,
        /vipchannel\.html/,
        /login\.html/,
        /my_collect\.html/,
        /visit_history\.html/,
        /my_order\.html/,
        /my_appraiseorder\.html/,
        /topayorder\/order2\.html/,
        /topayorder\/order8\.html/,
        /topayorder\/order3\.html/,
        /topayorder\/trans_page\.html/,
        /gift_order_received\.html/,
        /my_subscribe\.html/,
        /news_center\.html/,
        /shopping_cart\.html/,
        /my_coupons\.html/,
        /balance_account\.html/,
        /finance-index\.html/,
        /finance-licai\.html/,
        /product-(.+?)-(.+?)\.html/,
        /groupon_detail-(T.+?)\.html/,
        /rushbuy_detail-(Q.+?)\.html/,
        /vipchannel\.html/,
        /finance-index\.html/,
        /licai_p2p_list-(.+?)-(.+?)\.html/,
        /licai_gs_list-(.+?)-(.+?)\.html/,
        /licai_bill_list-(.+?)-(.+?)\.html/,
        /licai_xinshou_list-(.+?)-(.+?)\.html/,
        /finance-baina\.html/,
        /baina_detail-(.+?)\.html/,
        /baina_detail-(.+?)-(.+?)\.html/,
        /gs_detail-(.+?)\.html/,
        /finance-crowdfund\.html/,
        /finance-mycenter\.html/,
        /meiyingbao\.html/,
        /shop-(.+?)\.html/
    ]
    var parse = function(href,parttens){
        try {
            var protocol = href.match(/.+?:/)[0]
            var host = href.match(/\/\/(.+?)\//)[1]
            var pathname = href.match(/.+?:\/\/.+?(\/.*?.html)/)[1]
            for(var i=0; i<parttens.length; i++){
                if(parttens[i].test(href)){
                    return true
                }
            }
            return false
        }catch(e){
            return false
        }
    }
    window.jump = function(href,event){
        href = Transformer.transEnv(href)
        if($g.env.wap){
            if(event && event.target.getAttribute('params')){
                var params = event.target.getAttribute('params');
                window.location.href = href.indexOf('?')>-1 ? href+'&intcmp='+params : href+'?intcmp='+params
            }else{
                window.location.href = href
            }
            return;
        }
        if(href.match(/http[s]?:\/\//) ){
            //融合后版本号太坑爹，回退到30了，所以不判断版本号了，太坑。。。。
            //if(window.appVersion>=60){
                if(parse(href,parttens)){
                    window.location.href = href
                }else{
                    navigator.gome.util.nativeUtils.jumpExternalLink(href)
                }
            // }else{
            //     var href = oldMatch(href,parttens)
            //     if(href){
            //         window.location.href = href
            //     }else{
            //         navigator.gome.util.nativeUtils.jumpExternalLink(href)
            //     }
            // }
        }else{
            window.location.href = href
        }
    }
    console.log($g.env)
    window.checkHref = function(href){
        if(href.match(/http[s]?:\/\//) ){
            //融合后版本号太坑爹，回退到30了，所以不判断版本号了，太坑。。。。
            //if(window.appVersion>=60 && $g.env.gome == true){
                if(parse(href,parttens)){
                    e.preventDefault()
                    window.location.href = href
                }else{
                    e.preventDefault()
                    navigator.gome.util.nativeUtils.jumpExternalLink(href)
                }
            // }else{
            //     var href = oldMatch(href,parttens)
            //     if(href){
            //         e.preventDefault()
            //         window.location.href = href
            //     }else{
            //         e.preventDefault()
            //         navigator.gome.util.nativeUtils.jumpExternalLink(href)
            //     }
            // }
        }
    }

    //防止a标签
    if(!components.Config.platform.wap){
        document.body.addEventListener('click',function(e){
            function recurse(el){
                if(el.localName == 'a'){
                    if(el.href.match(/http[s]?:\/\//) ){
                        //融合后版本号太坑爹，回退到30了，所以不判断版本号了，太坑。。。。
                        //if(window.appVersion>=60 && $g.env.gome == true){
                            if(parse(el.href,parttens)){
                                e.preventDefault()
                                window.location.href = el.href
                            }else{
                                e.preventDefault()
                                navigator.gome.util.nativeUtils.jumpExternalLink(el.href)
                            }
                        // }else{
                        //     var href = oldMatch(el.href,parttens)
                        //     if(href){
                        //         e.preventDefault()
                        //         el.href = href
                        //     }else{
                        //         e.preventDefault()
                        //         navigator.gome.util.nativeUtils.jumpExternalLink(el.href)
                        //     }
                        // }
                    }
                }
                if(el.parentNode){
                    recurse(el.parentNode)
                }
            }
            recurse(e.target)
        });
    }else{
        document.body.addEventListener('click',function(e){
            function recurse(el){
                if(el.localName == 'a'){
                    if(el.href.match(/http[s]?:\/\//) || el.href.match(/^\/\//)){
                        e.preventDefault()
                        window.location.href = el.href
                    }
                }
                if(el.parentNode){
                    recurse(el.parentNode)
                }
            }
            recurse(e.target)
        });
    }
    return function(href){
        //融合后版本号太坑爹，回退到30了，所以不判断版本号了，太坑。。。。
        //if(window.appVersion>=60 && $g.env.gome == true){
            if(parse(href,parttens)){
                window.location.href = href
            }else{
                navigator.gome.util.nativeUtils.jumpExternalLink(href)
            }
        // }else{
        //     var href = oldMatch(href,parttens)
        //     if(href){
        //         window.location.href = href
        //     }else{
        //         navigator.gome.util.nativeUtils.jumpExternalLink(href)
        //     }
        // }
    }
}

$g.ready()
.then(function(){  

    //给wap做的loading
    if(document.querySelector('#pre-loading'))
        document.querySelector('#pre-loading').style.display = 'none'

    //防止ａ标签
    window.schemeFilterJump = preventHref()

    return $g.Promise.all([$g.getVersion(), $g.getAddress()])
    .then(function(data){
        var v = window.appVersion = data[0];
        var address = data[1];
        for(var key in address){
            $g.cookie.set('gps_'+key+'id', address[key].code, 1000 * 60 * 60 * 24 * 365)
        }
        window.provinceId = address.province.code;
        window.cityId = address.city.code;
        return $g.http0({
            "url": ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv("http://prom-mobile.gomeplus.com/mobile/promotion/promscms/promscms.jsp") : Transformer.transEnv("http://prom.mobile.gome.com.cn/mobile/promotion/promscms/promscms.jsp"),
            "type":"post",
            "data":{
                "provinceId": window.provinceId || "",
                "cityId": window.cityId || "",
                "extendParams": {
                    clientReferer: ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? "m.gomeplus.com" : "m.gome.com.cn"
                }
            }
        })
    })
}).then(function (data){
    if(data.isSuccess == 'N'){
        var error = new components.ErrorPage.Custom({
            data: {
                imageUrl: Transformer.transEnv('http://img.gomein.net.cn/mobile/cms/prom/hybrid/p/cms/src/images/activityEnd.png?v=20170306'),
                content: '来晚了，此活动已结束！',
            }
        }).$mount('#wrapper')
        error.$on('click',function(){
            window.location.reload();
        });
        return;
    }
    window.keyProms = data.pageInfo.keyProms;
    window.serverCurTime = new Date(data.serverTime.replace(/-/g,'/')).getTime();
   
    $g.setTitle(data.pageInfo.promoName)
    //反正现在都返回//，但是混合app是file协议，总之就是各种适配，贼乱
    if(data.pageInfo.shareImgUrl && !data.pageInfo.shareImgUrl.match(/^http/)){
        data.pageInfo.shareImgUrl = 'http:' + data.pageInfo.shareImgUrl;
    }
    //分享链接适配//
    if(data.pageInfo.shareUrl && !data.pageInfo.shareUrl.match(/^http/)){
        data.pageInfo.shareUrl = 'http:' + data.pageInfo.shareUrl;
    }
    /*
     * update cms  短链接接口调取分享
     * 如接口返回失败（参数错误等原因）则还取长链接
     */
    if($g.env.app){
        //TOREMOVE 不要短链分享了
        /*$g.http({
            "url": ( !$g.env.hybrid && location.host.match(/plus\.com/) ) 
                    ? Transformer.transEnv("//prom-mobile.gomeplus.com/mobile/promotion/shorturl/shorturl.jsp") 
                    : Transformer.transEnv("//prom.mobile.gome.com.cn/mobile/promotion/shorturl/shorturl.jsp"),
            "type": $g.env.hybrid ? 'post' : 'jsonp',
            "data": {
                "keyProms": data.pageInfo.keyProms
            }
        }).then(function (shareUrlData) {
            var shortUrl = data.pageInfo.shareUrl;
            if (shareUrlData.isSuccess == 'Y') {
                shortUrl = shareUrlData.shortUrl;
            }
            //分享
            $g.setShareInfo({
                'shareDesc': data.pageInfo.sharePromo || "发现了超值活动，速来围观！",
                'link': shortUrl,
                'imageUrl': data.pageInfo.shareImgUrl || 'http:' + Transformer.transEnv('//img.gomein.net.cn/mobile/cms/prom/hybrid/p/cms/src/images/gomelogo.png?v=1'),
                'title': data.pageInfo.promoName,
                'sharePlatform': '0,2,3'
            });
        }).catch(function (err) {*/
            $g.setShareInfo({
                'shareDesc': data.pageInfo.sharePromo || "发现了超值活动，速来围观！",
                'link': data.pageInfo.shareUrl,
                'imageUrl': data.pageInfo.shareImgUrl || 'http:' + Transformer.transEnv('//img.gomein.net.cn/mobile/cms/prom/hybrid/p/cms/src/images/gomelogo.png?v=1'),
                'title': data.pageInfo.promoName,
                //又不用了
//                'sharePlatform': '0,2,3'
            });
       // });
    }
    //适配后台加背景颜色的需求
    //@zhaoye
    //time:2016/11/02
    var style = document.createElement('style');
    style.innerHTML = '.cms.no-margin-top {margin-top: 0 !important}'
    if(data.pageInfo.pageBackColor){
        style.innerHTML += 'html,body{background-color:' + data.pageInfo.pageBackColor + '!important}';
    }
    document.querySelector('body').appendChild(style);
    cms.parse(data);
    cms.templetList.forEach(function(templet,idx){
        var templet = document.createElement('div')
        templet.id = 'templet'+idx;
        if(idx == 0)
            templet.className = 'cms first';
        else
            templet.className = 'cms';
        document.querySelector('#wrapper').appendChild(templet)
    })
    var idx = 0;
    var c = setInterval(function(){
        if(idx < cms.templetList.length){
            var templet = cms.templetList[idx]
            templet.options = templet.options  || {}
            templet.options['templetIdx'] = idx
            //适配模板边距
            if(!!templet.data.templateMargin){
                if(templet.data.templateMargin == 1){
                    document.querySelector('#templet' + idx).className += ' no-margin-top'
                }
            }
            if(templet.component){
                function showModulenew(){
                    new templet.component({
                        replace: false,
                        data: {
                            data: templet.data,
                            pageInfo: data.pageInfo,
                            options: templet.options
                        }
                    }).$mount('#templet'+idx)
                }
                //模板显示时间
                var startDate = typeof templet.data.startDate == 'string' ? templet.data.startDate.replace(/-/g,'/') : templet.data.startDate;
                var endDate = typeof templet.data.endDate == 'string' ? templet.data.endDate.replace(/-/g,'/') : templet.data.endDate;

                if(!startDate && !endDate){
                    showModulenew()
                }
                if(startDate || endDate){
                    if(!endDate)endDate = window.serverCurTime
                    //当前时间
                    var currentTime = window.serverCurTime;
                    //适配安卓
                    var startTime = new Date(startDate).getTime();
                    var endTime = new Date(endDate).getTime();
                    if(currentTime < startTime || currentTime > endTime){
                        document.querySelector('#templet' + idx).className = ''
                    }else{
                        showModulenew()
                    }
                }
                ///埋码跳转url加参数的逻辑
                var linksArr = document.querySelector('#templet' + idx).getElementsByTagName('a');
                var cnt = 0
                for(var i = 0;i<linksArr.length;i++){
                    var link_item = linksArr[i].getAttribute('href') 

                    if(link_item && link_item.match(/^\/\//)){
                        cnt++
                        linksArr[i].setAttribute('params', 'prom-' + templet.data.templetId + '-' + (cnt))
                        link_item = link_item.indexOf('?')>-1 ? link_item+'&intcmp='+('prom-' + templet.data.templetId + '-' + (cnt)) : link_item+'?intcmp='+('prom-' + templet.data.templetId + '-' + (cnt))
                        linksArr[i].setAttribute('href',link_item)
                        if(linksArr[i].querySelector('a') || linksArr[i].querySelector('button')){
                            if(linksArr[i].querySelector('a') ){
                                for(var x = 0;x < linksArr[i].querySelectorAll('a').length;x++){
                                    linksArr[i].querySelectorAll('a')[x].setAttribute('params', 'prom-' + templet.data.templetId + '-' + (cnt))
                                }                                
                            }else{
                                for(var y = 0;y < linksArr[i].querySelectorAll('button').length;y++){
                                    linksArr[i].querySelectorAll('button')[y].setAttribute('params', 'prom-' + templet.data.templetId + '-' + (cnt))
                                }                               
                            }
                        }
                    }
                }
            }
            idx++
        }else if(idx >= cms.templetList.length){
            new components.TipNoMore().$mount().$appendTo('body')
            if($g.env.wap && !window.navigator.userAgent.match(/gome/)){
                new components.BottomNav().$mount().$appendTo('body')
            }
            clearInterval(c)
        }
    })
}).catch(function error(){
    var error = new components.ErrorPage.Default().$mount('#wrapper')
    error.$on('click',function(){
        window.location.reload();
    })
})
