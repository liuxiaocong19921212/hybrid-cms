<template>
    <ctitle  :data="data"></ctitle>
    <scroller  :options="options" :style="bgStyle" :class="'daily-goods normal'">
        <product 
                v-for="(index, item) in data.goodsList"
                v-if="index <= 14"
                :data="item.transformed"
                :width="width">
            <mask slot="mask" v-if="item.transformed.state > 1">{{item.transformed.productState}}</mask>
            <!--本次改版去掉了-->
            <!--@zhaoye-->
            <!--@time:2016-11-09-->
            <!--<tag
                
                class="img-tag" 
                slot='mask-bottom-bar'>
                {{item.promoWord.substring(0,3)}}
            </tag>-->>
            <!--角标-->
            <tag v-if="data.superscriptStyle != 0 && item.shortWord" slot="tag">{{item.shortWord}}</tag>
            <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'groupon'"   slot="tag">团购</tag>
            <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'rushbuy'"   slot="tag">抢购</tag>
            <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'exclusive'" slot="tag">掌上专享</tag>
            <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType != 'exclusive' && item.transformed.rebatePriceDesc" slot="tag">返利</tag>
            <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'presell'"   slot="tag">预售</tag>

            <div slot="content">
                <div class="name">
                    {{item.transformed.name}}
                </div>
                <div class="price" :class="normalProduct(item)">
                    <strong>&yen;{{item.transformed.price}}</strong><del v-if="Number(item.transformed.price) < Number(item.transformed.originPrice) && item.transformed.originPrice">&yen;{{item.transformed.originPrice}}</del>
                </div>
                <!--<p v-if="item.goodsType == 0 && item.transformed.commentNum" class="comment">{{item.transformed.commentNum}}人评论</p>-->
                <!--<p v-if="item.goodsType == 28" class="comment">
                    <tag :class="'overseas'">海外购自营</tag>
                </p>-->
                <p  class="comment">
                    <span v-if="item.transformed.productType == 'rushbuy' && item.transformed.state == 1" class="info">{{item.goodsBean.priceBean.remainNumDesc}}</span>
                    <span v-if="item.transformed.productType == 'groupon' && item.transformed.state == 1" class="info">{{item.transformed.tipInfo}}人已参团</span>
                    <span v-if="item.transformed.rebatePriceDesc" class="info">{{item.transformed.rebatePriceDesc}}</span>
                </p>
            </div>
        </product>
    </scroller>
</template>
<script>
import comps from 'components'
import ctitle from '../title/ctitle.vue'
import priceGetter from '../goods/goods.mixin.vue'
import base from './dailyGoods.mixin.js'
export default(
    Vue.extend({
        mixins: [priceGetter,base],
        components: {
            'scroller': comps.Scroller,
            'product': comps.Product.Default,
            'tag': comps.ProductTagGradient,
            'ctitle': ctitle,
            'mask': comps.Product.Mask
        },
        data: function(){
            return {
                bgStyle: {
                    backgroundColor: ''
                }
            }
        },
        created: function(){
            console.log(this.data);
            this.options.wrapperWidth = document.body.offsetWidth - 15//15 == @templet-margin-side - .05rem;
            if(this.data.goodsBackColor){
                this.bgStyle.backgroundColor = this.data.goodsBackColor
            }
        },
        methods: {
            normalProduct: function(item){
                if(item.productType != 'groupon' && item.productType != 'rushbuy')
                    return 'normal'
                else
                    return ''
            }
        },
    })
)
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
@font-size-title: @font-lg - 0.02rem;
@img-padding: .15rem;
.scroller-container.daily-goods.normal{
    background: transparent;
    padding: @templet-margin-full;
    //因内部product 有左padding导致必须写这个参数
    //@templet-margin-side == .02rem
    padding-left: @templet-margin-side - .05rem;
    .scroller {
        background: transparent;
    }
}
.daily-goods.normal {
    .tip-slide-more {
        @font-size: @font-nm + 0.02rem;
        width: @font-size;
        position: relative;
        font-size: @font-size;
        color: @gray-light;
        .offset-wrapper {
            position: absolute;
            height: 100%;
            .flexbox();
            .flexbox.center();
            width: @font-size * 2;
            i {
                margin-right: @font-size / 2;
                transition: .3s all;
                &.left {
                    -webkit-transform: rotate(-90deg);
                }
                &.right {
                    -webkit-transform: rotate(-90deg) scaleY(-1);
                }
                .icon-font();
                font-size: @font-size;
            }
            .tip-content {
                width: @font-size;
                line-height: 1.2;
            }
        }
        
    }
    @img-width: 2.2rem;
    .product {
        width: @img-width + .03rem*2;
        margin-bottom: 0;
        padding: 0 .03rem;
        //@override
        background: transparent;
        a.react {
            background-color: @white;
        }
        .tag-linear {
            min-width: @img-width / 2;
        }
        .container {
            .mask {
                z-index: @z-nm + 10;
            }
            /*  
            改版去掉了
            @zhaoye
            @time:2016-11-09;
            .img-tag {
                position: absolute;
                z-index: @z-nm;
                left: 0;
                bottom: 0;
                border-radius: 0;
            }*/
            &.img {
                width: @img-width;
            }
            &.content {
                @comment-height: @font-nm-sm;
                padding: 0 .14rem .08rem .14rem;
                .name {
                    margin-top: .12rem;
                    .flexitem(1);
                    .set-ellipsis-line(2);
                    .set-line-height(2;@font-nm-sm * 1.3);
                    line-height: .32rem;
                    padding: 0;
                    font-size: @font-nm-sm;
                    color: @gray-dark;
                }
                .price {
                    margin-top: .09rem;
                    &.normal {
                        margin-top: .09rem + @comment-height/2;
                    }
                }
                strong {
                    display: inline-block;
                    .set-line-height(1;@font-lg-sm - .02rem);
                    font-size: @font-lg-sm - .02rem;
                    color: @red;
                    font-weight: bold;
                }
                .comment {
                    .set-line-height(1;@comment-height);
                    margin-bottom: .04rem;
                    .info {
                        font-size: @font-sm;
                        color: @gray-light;
                    }
                }
                del {
                    display: inline-block;
                    color: @gray-light;
                    font-size: @font-nm-sm;
                }
            }
        }
    }
}
</style>
