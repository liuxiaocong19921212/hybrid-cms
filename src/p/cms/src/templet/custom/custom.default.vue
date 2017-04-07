<template>
	<div class="custom" style="font-size:.24rem;background-color:#fff;line-height:.4rem;"></div>
</template>

<script>
	import Transformer from '../../utils/dataTransformer.js'
	export default (
		Vue.extend({
                    ready: function(){
                        var _this = this;
                        navigator.gome.util.nativeRequest.sendNativeRequest(
                            function(data){
                                //TODO
                                //预解析，把img里的src也变成lazyload
                                var imgList = data.match(/<img.*?src=["'].*?\.(jpg|png|gif|webp|bmp)["']/g)
                                var originImgs = [];
                                if(imgList){
                                    imgList.forEach(function(item,idx){
                                        var src = item.match(/<img.*?src=["'](.*?\.(jpg|png|gif|webp|bmp))["'].*/)[1]
                                        originImgs.push(src)
                                        data = data.replace(item, item.replace(/src=["'].+["']/,'v-lazyload:nohori="lazyImgs['+idx+']" src="data:image/gif;base64,R0lGODlhAwABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ODc5MkU1OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ODc5MkU2OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk4NzkyRTM5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk4NzkyRTQ5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAAwABAAACAoQLADs="'))
                                    })
                                }
                                //data = data.replace(/\<script.*?\<\/script\>/,'')
                                var lazyImg = "data:image/gif;base64,R0lGODlhAwABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ODc5MkU1OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ODc5MkU2OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk4NzkyRTM5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk4NzkyRTQ5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAAwABAAACAoQLADs="
                                new Vue({
                                    el: _this.$el.querySelector('.custom'),
                                    template: data,
                                    replace: false,
                                    data: {
                                        'lazyImgs': originImgs
                                    },
                                    ready: function(){
                                        var jumpList = document.querySelectorAll('[cms-jump]');
                                        for(var i=0; i<jumpList.length; i++){
                                            jumpList[i].addEventListener('click',function(e){
                                                if(!/[aA]/.test(this.tagName)){
                                                    e.preventDefault();
                                                    var href = this.getAttribute('href')
                                                    window.location.href = href;
                                                    return;
                                                }
                                            })
                                        }
                                    },
                                    compiled: function(){
                                        //do script\
                                        var scripts = this.$el.parentNode.querySelectorAll('script')
                                        for(var i=0; i < scripts.length; i++){
                                            var script = document.createElement('script')
                                            script.innerHTML = scripts[i].innerHTML
                                            this.$el.parentNode.appendChild(script)
                                        }
                                        //不是本平台的都删掉
                                        var platform = /android/i.test(navigator.userAgent) ? 'android' : 'ios'
                                        var node = null;
                                        if(platform == 'ios'){
                                            node = this.$el.parentNode.querySelector('.appshow.android')
                                        }else if(platform == 'android'){
                                            node = this.$el.parentNode.querySelector('.appshow.ios')
                                        }
                                        if(node){
                                            node.parentNode.removeChild(node)
                                        }

                                        //把wap应该显示的删除掉
                                        var wapdiv = this.$el.parentNode.querySelector('.wapshow')
                                        if(wapdiv)
                                            wapdiv.parentNode.removeChild(wapdiv)
                                        var list = this.$el.parentNode.querySelectorAll('.appshow[class*=lte]');
                                        var versionList = [];
                                        for(var i=0; i<list.length; i++){
                                            if(/lte(\d+)/.test(list[i].className)){
                                                versionList.push(Number(RegExp.$1))
                                            }
                                        }
                                        var _scope = this
                                        navigator.gome.util.nativeUtils.getAppVersion(function(data){
                                            data = typeof data == 'string' ? JSON.parse(data) : data
                                            var v = parseInt(data.dev_version)
                                            var vShow = 0
                                            versionList.forEach(function(item){
                                                if(v <= item){
                                                    vShow = item
                                                }
                                            })
                                            if(vShow == 0){
                                                for(var i=0; i<list.length; i++){
                                                    list[i].parentNode.removeChild(list[i])
                                                }
                                            }else{
                                                var appshow = _scope.$el.parentNode.querySelector('.appshow:not([class*=lte])')
                                                appshow.parentNode.removeChild(appshow)
                                                for(var i=0; i<list.length; i++){
                                                    if(list[i].className.match(/lte(\d+)/)[1] != vShow){
                                                        list[i].parentNode.removeChild(list[i])
                                                    }
                                                }
                                            }

                                            //商品scheme转换
                                            var pdsList = _scope.$el.parentNode.querySelectorAll('[cms-jump="goods"]')
                                            for(var i=0; i<pdsList.length; i++){
                                                var $el = pdsList[i]
                                                var pdType = $el.getAttribute('cms-attr-type')
                                                var pdParams = $el.getAttribute('cms-attr-params')
                                                //我也不知道这个是什么。。。。by zhaoye
                                                var skipType = /skipType=(\d+?)/.test(pdParams) ? Number(RegExp.$1) : 0
                                                var skuId = /^([a-zA-Z0-9]+?)&/.test(pdParams) ? RegExp.$1 : null
                                                var goodsNo = /&No=(.+?)&/.test(pdParams) ? RegExp.$1 : null
                                                var isPresell = skipType == 5 ? true : false
                                                var href = Transformer.transGoodsHref(Number(pdType),goodsNo || skuId,skuId,isPresell) || 'javascript:;'
                                                $el.setAttribute('href',href)
                                            }
                                            //比较特殊
                                            var bigDownList = _scope.$el.parentNode.querySelectorAll('[cms-jump="weipinhui"]')
                                            for(var i=0; i<bigDownList.length; i++){
                                                var href = 'gome://h5.weipinhui.product.list'
                                                $el.setAttribute('href',href)
                                            }
                                            //跳转
                                            var jumpList = _scope.$el.parentNode.querySelectorAll('[cms-jump]'
                                                                                                    +':not([cms-jump="goods"])'
                                                                                                    +':not([cms-jump="weipinhui"])')
                                            for(var i = 0; i < jumpList.length; i++){
                                                var $el = jumpList[i]
                                                var id = $el.getAttribute('cms-jump')
                                                var type = $el.getAttribute('cms-attr-type') || 'home'
                                                if(type == 'merchant'){
                                                    var channel = $el.getAttribute('cms-attr-params').match(/(^\d+)/)[1]
                                                }else
                                                    var channel = $el.getAttribute('cms-attr-channel') || ''
                                                var href = Transformer.transSchemeHref(id,type,channel) || 'javascript:;'
                                                $el.setAttribute('href',href)
                                            }
                                            //领券
                                            var coupons = _scope.$el.parentNode.querySelectorAll('[cms-action="goupon"]')
                                            for(var i = 0; i < coupons.length; i++){
                                                var $el = coupons[i]
                                                $el.addEventListener('click',function(){
                                                   var id = this.getAttribute('cms-attr-id')
                                                   var type = this.getAttribute('cms-attr-type')
                                                    $g.getUserInfo()
                                                    .then(function(){
                                                        $g.http({
                                                            'url': ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://prom-mobile.gomeplus.com/mobile/promotion/takeUpAllCoupon.jsp') : Transformer.transEnv('http://prom.mobile.gome.com.cn/mobile/promotion/takeUpAllCoupon.jsp'),
                                                            'data': {
                                                                couponParam: id
                                                            },
                                                            'type': 'POST'
                                                        }).then(function(data){
                                                            data = (typeof data == "string") ? JSON.parse(data) : data
                                                            if(data.status == 'N'){
                                                                navigator.gome.util.nativeUtils.showToast(data.msgContent || data.failReason)
                                                            }else{
                                                                navigator.gome.util.nativeUtils.showToast("领券成功")
                                                            }
                                                        }).catch(function(data){
                                                            navigator.gome.util.nativeUtils.showToast(!!data ? (data.failReason || "领券失败") : "领券失败")
                                                        })
                                                        return true
                                                    })
                                                    .catch(function(){
                                                        $g.login()
                                                    })
                                                })
                                            }
                                        })
                                    },
                                })
                            },
                            function(){
                                //$g.toast('')
                                //navigator.gome.util.nativeUtils.showToast('加载自定义模板失败');
                            },{
                                "url": (function(){
                                    var returnUrl = _this.data.promsUrl;
                                    if(location.host.match(/atguat|gome\.com\.cn/)){
                                        if($g.env.live){
                                            returnUrl = _this.data.promsUrl.replace(/gomeplus\.com/, 'gome.com.cn')
                                        }else{
                                            if(location.host.match(/prom\.atguat/)){
                                                returnUrl = _this.data.promsUrl.replace(/prom\.m\.uatplus\.com/, 'prom.atguat.com.cn')
                                            }else{
                                                returnUrl = _this.data.promsUrl.replace(/prom\.m\.uatplus\.com/, 'prom.m.atguat.com.cn')
                                            }
                                        }
                                    }else if(location.host.match(/uatplus\.com|gomeplus\.com/)){
                                        if($g.env.live){
                                            returnUrl = _this.data.promsUrl.replace(/gome\.com\.cn/, 'gomeplus.com')
                                        }else{
                                            returnUrl = _this.data.promsUrl.replace(/atguat\.com\.cn/, 'uatplus.com')
                                        }
                                    }
                                    return returnUrl;
                                })(),
                                "type":"GET",
                                "isNeedLoading":"N"
                            }
                        );
                    }
                })
	)
</script>
