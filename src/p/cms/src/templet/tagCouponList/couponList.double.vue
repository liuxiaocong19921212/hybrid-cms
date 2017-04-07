//couponList.double.vue
<template>
    <list-col2 v-show='isShow'>
        <flexgrid v-for="item in data.doubleList">
            <div class="coupon" :style="style">
                <img @click="onClick($index,0)" src="data:image/gif;base64,R0lGODlhAwABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ODc5MkU1OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ODc5MkU2OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk4NzkyRTM5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk4NzkyRTQ5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAAwABAAACAoQLADs="
                v-lazyload:nohori="item[0].imageUrl">
            </div>
            <div class="coupon" :style="style">
                <img v-if="item[1]" @click="onClick($index,1)" src="data:image/gif;base64,R0lGODlhAwABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ODc5MkU1OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ODc5MkU2OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk4NzkyRTM5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk4NzkyRTQ5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAAwABAAACAoQLADs="
                v-lazyload:nohori="item[1].imageUrl">
            </div>
        </flexgrid>
    </list-col2>
</template>
<script>
    import comps from 'components'
    import Transformer from '../../utils/dataTransformer.js'
    export default (
        Vue.extend({
            components: {
                'list-col2': comps.ListCol2,
                'flexgrid': comps.Flexgrid
            },
            data: function(){
                return {
                    data: [],
                    type: {},
                    isShow: false
                }
            },
            created: function() {
            },
            methods: {
                onClick: function(idx,__idx){
                    var index = idx * 2 + __idx;
                    $g.getUserInfo()
                    .then(function(){
                        $g.http({
                            'url': ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://prom-mobile.gomeplus.com/wap/promotion/takeUpAllCoupon.jsp') : Transformer.transEnv('http://prom.mobile.gome.com.cn/wap/promotion/takeUpAllCoupon.jsp'),
                            'data': {
                                couponParam: this.data.couponList[index].couponParam
                            },
                            'type': 'post',
                        })
                        .then(function(data){
                            if(data.status == 'N'){
                                $g.toast(data.msgContent || data.failReason)
                            }else{
                                var content = {}
                                //不是红券，购物券
                                //且有链接
                                //才显示"快来使用吧"
                                if(this.data.couponList[index].couponType != 0
                                    && this.data.couponList[index].couponType != 5
                                    && (this.data.couponList[index].merchantId
                                        || this.data.couponList[index].promsUrl
                                        || this.data.couponList[index].blueRule)){
                                    content = {
                                        title: '领券成功',
                                        ok: '我的优惠券',
                                        cancel: '快来使用吧',
                                        hasClose: true,
                                    }
                                }else{
                                    content = {
                                        title: '领券成功',
                                        ok: '我的优惠券',
                                        hasClose: true,
                                    }
                                }
                                new comps.Alert.Default({
                                    data: content,
                                    events: {
                                        ok: function(){
                                            //理财券
                                            if(this.data.couponList[index].couponType == 8 ){
                                                window.jump(Transformer.transEnv('http://jr.m.gome.com.cn/my_coupon.html'))
                                            //其他券
                                            }else{
                                                window.jump(Transformer.transEnv('http://u.m.gome.com.cn/my_coupons.html'))
                                            }
                                        }.bind(this),
                                        cancel: function(){
                                            //蓝券
                                            if(this.data.couponList[index].blueRule
                                                && this.data.couponList[index].couponType == 1){
                                                window.jump(Transformer.transEnv('http://m.gome.com.cn/coupons_center_list-'+ this.data.couponList[index].blueRule +'-0-1.html'))
                                            //店铺券
                                            }else if(this.data.couponList[index].merchantId
                                                && this.data.couponList[index].couponType == 3){
                                                window.jump(Transformer.transEnv('http://m.gome.com.cn/shop-' + this.data.couponList[index].merchantId + '.html'))
                                            }else{
                                                window.jump(this.data.couponList[index].promsUrl)
                                            }
                                        }.bind(this)
                                    }
                                })
                            }
                        }.bind(this))
                        .catch(function(data){
                            if(data && data != 'notLogin'){
                                $g.toast(data.msgContent || data.failReason || '领券失败')
                            }
                        })
                    }.bind(this))
                    .catch(function(){
                        $g.login()
                        return 'notLogin'
                    })
                }
            }
        })
    )
</script>
<style lang='less'>
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/var.less';
    .list{
        &.col2 {
            .flexgrid {
                .coupon {
                    background-color: @white;
                    .flexitem(1);
                    width: 50%;
                    padding: .2rem;
                }
            }
        }
    }
</style>
