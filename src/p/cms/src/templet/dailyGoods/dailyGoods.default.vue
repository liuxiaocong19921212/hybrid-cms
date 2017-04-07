<template>
    <ctitle :data="data"></ctitle>
    <div class="swiper-box" :style="BGstyle">
        <swiper v-bind:options="options" v-bind:list="data.goodsList" class="daily-goods default">
            <slider v-for="item in data.goodsList" v-bind:options="options" slot="slider">
                <product :data="item.transformed" :width="width">
                    <!--角标-->
                    <tag v-if="data.superscriptStyle != 0 && item.shortWord" slot="tag">{{item.shortWord}}</tag>
                    <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'groupon'" slot="tag">团购</tag>
                    <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'rushbuy'" slot="tag">抢购</tag>
                    <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'exclusive'" slot="tag">掌上专享</tag>
                    <tag v-if="data.superscriptStyle != 0 && !item.shortWord && item.transformed.productType == 'presell'" slot="tag">预售</tag>
                    <mask slot="mask" v-if="item.transformed.state > 1">{{item.transformed.productState}}</mask>
                    <div slot="content">
                        <p class="name">{{item.transformed.name}}</p>
                        <strong><span v-if="item.transformed.price != '敬请期待'">&yen;</span>{{item.transformed.price}}</strong>
                    </div>
                </product>
            </slider>
            <pagination v-if='pageType' :class="pageType" :style="BGstyle"></pagination>
        </swiper>
    </div>
</template>
<script>
    import comps from 'components'
    import ctitle from '../title/ctitle.vue'
    import priceGetter from '../goods/goods.mixin.vue'
    import base from './dailyGoods.mixin.js'
    export default (
    Vue.extend({
        mixins: [priceGetter,base],
        components: {
            'swiper': comps.Swiper,
            'slider': comps.Slider,
            'pagination': comps.Pagination,
            'product': comps.Product.Default,
            'productTag': comps.ProductTag,
            'tag': comps.ProductTagGradient,
            'mask': comps.Product.Mask,
            'ctitle': ctitle,
        },
        created: function(){
            this.options.wrapperWidth -= 0.18 * document.rem * 2;
        },
        computed: {
            width: function () {
                return this.options.wrapperWidth/this.options.perSliders
            },
            BGstyle: function () {
                return {
                    background: this.data.goodsBackColor,
                    margin: 0
                }
            }
        }
    })
)
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
.swiper-box{
    padding: @templet-margin;
    padding-left: @templet-margin-side - .03rem;
    padding-bottom: .1rem;
    .daily-goods.default {
        .swiper {
            .slider {
                .product {
                    background-color: transparent;
                    padding: 0 .03rem;
                    a {
                        background-color: @white;
                        padding-top: .07rem;
                    }
                    margin-bottom: 0;
                    .container {
                        text-align: center;
                        .tag-linear {
                            margin-right: -.07rem;
                            margin-top: -.07rem;
                        }
                        &.img {
                            margin: 0 .07rem .1rem .07rem;
                        }
                        &.content {
                            margin: .15rem 0.08rem .14rem;
                            .name {
                                margin-bottom: .08rem;
                                .flexitem(1);
                                .ellipsis-line(1);
                                .set-line-height(1;@font-nm-sm);
                                padding: 0;
                                font-size: @font-nm-sm;
                                color: @gray-dark;
                            }
                            strong {
                                display: block;
                                margin-bottom: .08rem;
                                .set-line-height(1;@font-nm);
                                font-size: @font-nm;
                                color: @red;
                                font-weight: bold;
                            }
                            del {
                                display: block;
                                color: lighten(@gray,20%);
                                font-size: @font-sm + 0.02rem;
                            }
                        }
                    }
                }
            }
            .pagination {
                height: @font-sm*1.4;
            }
        }
    }
}

</style>
