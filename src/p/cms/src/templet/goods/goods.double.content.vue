/**
 * 双列商品  商品信息部分
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
<template>
    <!-- 商品类型标签 -->
    <em class="name"><tag v-if="data.isBBC == 'N'">自营</tag><tag :class="{'overseas':data.productType== 'overseas'}" v-if="data.isBBC != 'N' && data.productType== 'overseas'">海外购</tag><span>{{data.name}}</span></em>
    <!-- 商品信息 -->
    <div class="subtitle">
         <p class="info ellipsis" :class="shoppingGroup">
             <i v-if="data.productType == 'exclusive' && data.discountPrice" class="icon-font">&#x2026;</i>
             <span class="vip-commodity" v-if="data.rebatePriceDesc || data.productType=='vip' && !this.data.promoWord">
                 <i v-if="data.rebatePriceDesc">返</i>
                 <i v-if="!data.rebatePriceDesc && data.productType=='vip'">VIP</i>
                 {{promotionSay}}
             </span>
             <span v-else>{{promotionSay}}</span>
             <!-- data.promoWord -->
         </p>
     </div>
    <!-- 价格、购物车 -->
    <div class="desc">
        <div class="price">
            <strong :class="{'baina': data.productType == 'nomoney'}">
                <!--注意-->
                <!--这段是因为防止display inline-block的空格，所以写成了一行-->
                <span v-show="data.price"><span v-if="data.price != '敬请期待' && data.productType !='nomoney'">&yen;</span></span><span v-show="data.price">{{data.price}}</span><span v-show="!data.price">--</span>
            </strong>
            <!-- 
                **因需求变更，仅剩标签暂不显示
                ** author: 刘晓丛
                ** time:2016/10/28 
                **因需求变更，仅剩不在这里显示了
                ** 补充： 赵晔
                ** time:2016/11/16 
             -->
            <!-- <p class="tip" v-if="data.productType == 'rushbuy'">
                <span v-if='data.tipInfo'>仅剩{{data.tipInfo}}件</span>
            </p> -->
            <!-- 
            <tag v-if="data.productType == 'exclusive'">
                <i class="icon-font">&#x2026;</i>比pc端省{{data.discountPrice}}元
            </tag> -->
        </div>
        <!-- 加入购物车 -->
        <!--cartType见cart.mixin.vue-->
        <div class="add-cart" 
            v-if="cartType == 'icon' && this.data.productType != 'nomoney'" 
            :class="[cartFlag,greyUnclick]"
            @click.stop.prevent="onCartBtnClick($event)">
            <button class="add-btn"></button>
        </div>
        <!-- 
        <div v-show="showCartFlag == 1" class="add-cart" @click.stop.prevent="isLogin" v-if="data.productType == 'normal'||data.productType == 'exclusive'">
            <button class="add-btn"></button>
        </div> -->
    </div>
    <!-- 购物车大button -->
    <!--cartType见cart.mixin.vue-->
    <div class="go-buy" 
        v-if="cartType == 'btn'" 
        :class="[cartFlag, greyUnclick]" 
        @click.stop.prevent="onCartBtnClick($event)">
        <button>{{data.productState}}</button>
    </div>

</template>
<script>
    /**
     * 数据转换器
     */
    import Transformer from '../../utils/dataTransformer.js'
    /**
     * 组件库
     */
    import comps from 'components'
    /**
     * 购物车按钮base逻辑
     */
    import cartBase from './cart.mixin.vue'
    /**
     * 组件
     */
    export default ({
        mixins: [cartBase],
        /**
         * 继承自父组件数据
         * 
         */
        props: ['data', 'pageInfo', 'showCartFlag','showButtonFlag'],
        components: {
            'tag': comps.Tag.Icon
        },
        /*
         * data 模板数据
         * cartBtnContent  购物车按钮文字
         * cartFlag 购物车样式类型
            确认是选图标 还是按钮
         * cartFlagArr 购物车样式
             1-2 为图标  3-4 为按钮
         * promotionSay 商品类型说明语
         */
        data: function() {
            return {
                isTagShow: false,
                cartFlag:{},
                cartFlagArr:['one','two','three','four'],
                shoppingGroup:{},
                promotionSay:'',
                greyUnclick:''
            }
        },
        created:function(){
            /**
             * 购物车样式选择
             */
            this.cartFlag[this.cartFlagArr[this.showCartFlag-1]]= true;
            /**
             * 购物车长button
             * 团抢 取商品状态
             * 预售 立即预定
             * 海外购、普通商品 立即购买
             */
            if(this.data.productType =='rushbuy' || this.data.productType =='groupon'){
                if(this.data.state != 1){
                    this.greyUnclick = 'grey-unclick';
                };
                this.$watch('data.state', function(state){
                    if(state != 1){
                        this.greyUnclick = 'grey-unclick';
                    }
                })
            }
            //shortWord 动态获取
            //promoWord 手动配置的
            /*
             * 促销语
               ↓ 无促销语时才显示(商品类型说明语)
             * 抢购    仅剩X件
             * 团购    X人已参团
             * 预售    定金X元
            */
            if(this.data.productType == 'rushbuy' && this.data.state == 1){
                //抢购商品特征语
                this.shoppingGroup.shopGropColor = true;
                this.promotionSay = '仅剩'+this.data.tipInfo+'件';    
            }else if(this.data.productType == 'groupon'  && this.data.state == 1){
                this.shoppingGroup.shopGropColor = true;
                this.promotionSay = this.data.tipInfo+'人已参团';
            }else if(this.data.productType == 'exclusive'){
                if(this.data.discountPrice){
                    //展示专享优先显示商品特征语
                    this.shoppingGroup.ui = true;
                    this.shoppingGroup.tag = true;
                    this.shoppingGroup['icon-tag'] = true;
                    this.promotionSay = '比pc端省'+this.data.discountPrice+'元';    
                }
            }else if(this.data.productType == 'nomoney' || this.data.productType == 'presell'){
                //白拿和预售优先展示促销语
                if(this.data.promoWord){
                    this.promotionSay = this.data.promoWord
                }else{
                //无促销语展示商品特征语
                    if(this.data.productType == 'presell'){
                        this.promotionSay = '定金'+this.data.tipInfo+'元';
                    }
                }
            }else if(this.data.rebatePriceDesc){
                this.promotionSay = this.data.rebatePriceDesc;
            }else if(this.data.productType=='vip'){
                if(this.data.promoWord){
                    this.promotionSay = this.data.promoWord;
                }else{
                    this.promotionSay = this.data.vipPriceTitle;
                }
            }else{
                this.promotionSay = this.data.promoWord;
                //其他有促销语则展示促销语
            }
        }
    })
</script>
<style lang='less'>
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/product/style/product.less';
    @import 'goods.less';
    @name-height: @font-nm * 1.2;
    @btn-height: 0.48rem;
    @price-font-size: @font-lg-sm + .02rem;
    @price-line-height: @price-font-size;
    .list {
        &.col2 {
            .product {
                .container {
                    &.content {
                        .name {
                            color: @gray-dark;
                            font-size: @font-nm - 0.02;
                            margin-top: @font-nm / 2;
                            .set-line-height(2, @name-height);
                            line-height: .376rem;
                            .set-ellipsis-line(2);
                            .tag{
                                border-radius: .05rem;
                                padding: 0 .02rem;
                                font-size: @font-sm;
                                .set-line-height(1, 1.3 * @font-sm);
                                margin-right: .05rem;
                                &.overseas{
                                    color: #bd42dc;
                                    border-color: #bd42dc;
                                }
                            }
                        }
                        .subtitle{
                            margin-top: .1rem;
                            height: .25rem;
                            font-size: @font-nm-sm;
                            color: @red;
                            .shopGropColor {
                                color: #a2a4a6;
                            }
                            .tag {
                                .set-line-height(1, @font-nm);
                                overflow: hidden;
                                border-radius: 2px;
                                i {
                                    transform: translateY(-0.02rem);
                                    .set-line-height(1, @price-line-height);
                                    vertical-align: top;
                                    background-color: @red;
                                    color: @white;
                                    margin-right: .03rem;
                                }
                            }
                            .vip-commodity{
                                border: 1px solid @red;
                                padding-right: .04rem;
                                font-size: .24rem;
                                line-height: .25rem;
                                float: left;
                                i{
                                    background: @red;
                                    color: #fff;
                                    padding:0 .02rem;
                                    margin-right: .05rem;
                                    float: left;
                                }
                            }
                        }
                        .desc {
                            .flexbox();
                            margin-top: .3rem;
                            .price {
                                .flexitem(1);
                                //不知道这个.8rem干嘛用的，先注释
                                //height: .8rem;
                                font-weight: bold;
                                strong {
                                    font-weight: bold;
                                    display: block;
                                    color: @red;
                                    font-size: @price-font-size;
                                    .set-line-height(1, @price-line-height);
                                    &.disable {
                                        color: @gray;
                                    }
                                    &.baina {
                                        font-size: @price-font-size - .04rem;
                                    }
                                }
                                .tip {
                                    font-size: @font-nm-sm;
                                    color: lighten(@gray, 20%);
                                }
                            }
                            .add-cart {
                                position: relative;
                                width: @btn-height + 0.2;
                                height: @btn-height + 0.2;
                                margin-top: -.25rem;
                                &.grey-unclick{
                                    .add-btn{
                                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAmVBMVEUAAAD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PTMzMzu7u7Q0NDx8fHZ2dnm5ubh4eHV1dXr6+vS0tLc3Nzo6OjNlZC+AAAAJnRSTlMAVSPyzPoGAbeM7rGfP+vfpI8oCoX37OTQwYB6X100Krh4NZhwMluU9swAAAItSURBVFjDrZjrcuIwDIVFQoAk3KGFUqC0u3uUO9D3f7id8XRaHJTELv7+BYYzljhSJFMjw+UhjLcbH/A32zg8LIdkyao3n6LGdN5bkTnHsQ8Rf/xBZkxe0MLLhLp5G6GD0VuHxGAdoJNgPaAWvD6M6HvUSM+HIX6PGniFBa+yuRawIpTMt4Ala7rjHdb8vcspfkEtu14E4JxyWpUZjIk8zWPKH1dWlDCmf+u6HQB1EsUVxuxugnnCF1lRWZ3l6Seg25pTQZnnZfRd+9CorNIyuTuIomCuYHuUI3QS5hTm/FMiY9RgZpjzR/VkXxCREb0YDUTDcyvXTDD/3FKE0zM0xkTDKYxzkiXKi5xon26IloBVYj9T5gs0PDrYiSgHcKF9sqfQVgQlc643Soq7RbrMGFO/S6T7+z7NHheZ0fPjIs8UPC4SOBFxEo6TxDr5iyWzdXTqrC4SS7a/6HVa51yvwFAqwJy5tKmdvdQKCuY0a42m0FuB1JSQMldZk0ZVj2Yjtkd8MnNaJpnQ2sqUmc+19ihPJgW3Udw36pUvN8EmLmfhlUFjSBS52OnzQnx50VHuX6n6USI86xxJcYJAzopceNY4aaOF4P1bgzNzkghVNRGGHFuRkzZuWYQjj1u0+21id9oIKqjkzHkiPssjqBqG7Yk8F2O5gwXh3cGqsnCwNC2GLtc394uk/Urrfrm2X/PdXzjIfJhefbi/hJGvg/ZhvJ1FQRDNtnG4b7kO+g+pBRih2befmwAAAABJRU5ErkJggg==) no-repeat !important;
                                        background-size: 100% 100% !important;
                                    }
                                }
                                &.one{
                                    .add-btn{
                                        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAA9lBMVEUAAADm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ub/////XFzm5ub9/f3q6ur4+Pj7+/vw8PD/ZGTv7+/09PT/kJD/YWH6+vr/5ub/Zmb/7u7/5+fy8vLs7Oz/+fn/xMT/aWn/29v/dHT/bW3/8vL/sLD/4eH/09P/y8v/nZ3/iYn/e3v/trb/srL/q6v/l5f/hYX/fn7/vLwMxUlJAAAAKXRSTlMA+ezMKVT+8bGfMyR5B/Pft6SMViIKjYXk0MGPgGBePLi2BvSYQkFwU2gMGKAAAAMTSURBVFjDtZhpU9swEIZth1yEkHDfZwutdn3EdpzEuUPDWQr0//+ZakLLIl+RSni/aTTzeHcl7yEtXUvH66W93VXE1d290vrxkqaqrY01AyMy1ja2FBDLZf59tDzfbjkmY6bTsn3PQm5TeVkScbmPiH3fYRE5fp9v7F9KIJbq3IYGEUROg9tTnxed6o6OVo9lqGehvlPNYmzmEBsmy5TZQMxtpjPyRbRsNle2hcV8GmOlgJ7JJGR6WFhJZmxzV5ikuEvbKQybSctG3EnwBbHFmBLlW5TxvUB2yFIK+cjZFike8nEpCid9nkOPsfEIRs/TUJriYe5cIx2ixc/2DoArmMpCTAsPiVHReUBmlsz0JB8WvfIGOePOvCocvnDKT3mH6v8YJ9wZspE75f6Qd+jkzZDe+40HBVN6ePY3j80MIQ0B7hVi+5rrypErEgKMFC7L11lO/oKOSAcIpCEOGlUO2cA+EwWpurp/jN7FPuY5ZA39+RBScCcenY9lDjHQUYFwc8aiP7s8u6PF4hCWqEF3+Mw3O232ThZWtGP0JCCk2w7Agync2iNtHX0lCLt2AW6FoGxrJbTVIOwXQFP4C0taDluKkDaPLSO1MKfV0FGEmOK+gzV+wqYKJL5voqHpH4foC4Esxh31wLJYYOmIlSF0xHTZlCF02ZKufQAwyGAMAFzx2if9gBOAdgZkDDARf8CkVNAEeMz+d57EVEBJSUj3o/TKE3YAboWklJgeB1cAL2mU8IF7Y0bSIyVq0g1wW6bXg3hMr6cjgGAcS9RUMki/IUvDWMmg4iXYMklFTG7ixYvKqGj48D5IyvTNoZlYRrVTKuikbgcoscfWVNBPhdYifllcF6BJawgCWsdaC62eEBUXgjAMwKU1tNscHCnnp0K7JQHpdglC7ZbQ+Km7Q40ftaCi2hTI2Jpa0OqcZrjbdN1mN7aON8Ok/ALacvUBoYWYMPIcqI4qBxqJKGpD08HnjG8fHyRJFdmRtvK5w/XHx3zSRfaDw8X/PH1wKT99qD/CZEfniD8H1QxdN2r8OegoIxJ/AOS6UjvmaQgvAAAAAElFTkSuQmCC);
                                        background-size: 100% 100%;
                                    }
                                }
                                .add-btn {
                                    width: 100%;
                                    height: 100%;
                                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAmVBMVEUAAAD/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/////9vb/dnb/+fn/y8v/bGz/lpb/7+//qqr/YmL/6Oj/39//1NT/iYn/f3//vr7/o6P/sbGpuvtbAAAAIHRSTlMAVY358M236ygk9LGeXzN5B9+kCoUi5NHBgDwGmEJBcCHWojoAAAI7SURBVFjDvZhrd+IgEIYxFzUmWu+t7bY7L5CLd7v//8dt656WFUgMSU6fb8RzngM4DDOwcoZjL35cj4hG68fYGw+ZK4vefEAag3lv4aCYJCOyMkomNRVvT1TB01sNxbBPd+jf253p0qe7+MtplWMVUi3CVbmjF1BNgl6Z44EceLA7PHLCa+FQLFusRfHb2FNqgLa7q6CJJLj5p18+4+NcgB+3mYslfGGKDX1wwSdy62LZKEd0jfUTx5XUQeJH35LvM5flBwDvDpb+l+OZ/uMCcJd9edYncuXQaCoTuiEHjuTAv1yX0A0ZULhIfl1zsp5PAekUcVNbwKOUQsWiFvxzQ1KFvBia5EMycJIAxZluWTM2JIuErOxEfgTAhfY9YuP6kq+zcdC+jZnnJiEhgVxPlLGjhP4YRzRmoatEGMEYspmrxPx9xgbtJQPmt5f4nUg6WU43Gxu2l4Qsbi+JLWEvgV2FYwdwPezNA7gHRIXkDOz1A2imghTYOp2dyJKUcqDISh0Z10/x2pYedwVwyMocB2M1ibUyOQHgW7GzpLYtB+TZTNQLswR/RxW55cpgiSUJ7lHG/mS7vNiELORHCZMizUuuUdYnE8GhErs5VvRVaWELFimB1BybpUXpVDhklklwNYYQADcnosotZ4lZbrFN0+VstBK0ycaG0+piWKScp8I2VgRRJ2V5+wbhoVGr0n3D43XbvrVvJE2iui1t1G1z3X2br3itfnB4/amnj/aPMOZz0Czw/WB25znoL7Q0xXS1fkMsAAAAAElFTkSuQmCC);
                                    background-size: 100% 100%;
                                }
                            }
                        }
                        .go-buy{
                            margin-top: .18rem;
                            &.three{
                                button{
                                    background: @white;
                                    color: @red;
                                    border: 1px solid @red;
                                }
                            }
                            &.grey-unclick{
                                button{
                                    background: @gray-dark-border;
                                    color: @gray-lighter;
                                    border: none;
                                }
                            }
                            button{
                                width: 100%;
                                border-radius: 0.45rem;
                                height: 0.56rem;
                                background: @red;
                                color: @white;
                                font-size: @font-nm - 0.02;
                            }
                        }
                    }
                }
            }
        }
    }
</style>