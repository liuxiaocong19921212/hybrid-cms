<template>
    <div @click="onClick">
        <img :src="data.imageUrl" >
   </div>
</template>
<script>
    import comps from 'components'
    import Transformer from '../../utils/dataTransformer.js'
    /*
    红券 0
    蓝券 1
    品牌券 2
    店铺券 3
    折扣券 4
    平台券(购物券) 5
    组合券 6
    理财券 8
     */
    export default ({
        props: ['data'],
        methods: {
            getCoupon: function(){
                $g.http({
                    'url': ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv("http://prom-mobile.gomeplus.com/wap/promotion/takeUpAllCoupon.jsp") : 
                    Transformer.transEnv("http://prom.mobile.gome.com.cn/wap/promotion/takeUpAllCoupon.jsp"),
                    'data': {
                        couponParam: this.data.couponParam
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
                        if(this.data.couponType != 0
                            && this.data.couponType != 5
                            && (this.data.merchantId
                                || this.data.promsUrl
                                || this.data.blueRule)){
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
                                    if(this.data.couponType == 8 ){
                                        window.jump(Transformer.transEnv('http://jr.m.gome.com.cn/my_coupon.html'))
                                    //其他券
                                    }else{
                                        window.jump(Transformer.transEnv('http://u.m.gome.com.cn/my_coupons.html'))
                                    }
                                }.bind(this),
                                cancel: function(){
                                    //蓝券
                                    if(this.data.blueRule
                                        && this.data.couponType == 1){
                                        window.jump(Transformer.transEnv('http://m.gome.com.cn/coupons_center_list-'+ this.data.blueRule +'-0-1.html'))
                                    //店铺券
                                    }else if(this.data.merchantId
                                        && this.data.couponType == 3){
                                        window.jump(Transformer.transEnv('http://m.gome.com.cn/shop-' + this.data.merchantId + '.html'))
                                    }else{
                                        window.jump(this.data.promsUrl)
                                    }
                                }.bind(this)
                            }
                        })
                    }
                }.bind(this))
                .catch(function(data){
                    if(data){
                        $g.toast(data.msgContent || data.failReason || '领券失败')
                    }
                })
            },
            onClick: function(){
                $g.getUserInfo()
                .catch(function(){
                    $g.login()
                })
                .then(function(){
                    this.getCoupon()
                }.bind(this))
            }
        }
    })
</script>
<style lang='less'>
    
</style>