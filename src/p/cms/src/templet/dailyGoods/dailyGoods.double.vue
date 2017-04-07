<template>
    <ctitle :data="data"></ctitle>
    <swiper v-bind:options="options" v-bind:list="data.goodsList" class="daily-goods double">
        <slider v-for="item in data.goodsList" v-bind:options="options" slot="slider">
            <product :data="item.transformed" :width="width">
                <product-tag slot="subinfo" :content="1000"></product-tag>
                <mask slot="mask" v-if="item.transformed.state > 1">{{item.transformed.productState}}</mask>
                <div slot="content">
                    <p class="name">{{item.transformed.name}}</p>
                    <strong><span v-if="item.transformed.price != '敬请期待'">&yen;</span>{{item.transformed.price}}</strong>
                    <p v-if="item.goodsType == 0 && item.transformed.commentNum" class="comment">{{item.transformed.commentNum}}人评论</p>
                    <p v-if="item.goodsType == 28" class="comment">
                        <tag :class="'overseas'">海外购自营</tag>
                    </p>
                    <!-- 
                        **因需求变更，仅剩标签暂不显示
                        ** author: 刘晓丛
                        ** time:2016/10/28 15:15
                    -->
                    <p v-if="item.productType == 'rushbuy' && item.state == 1" class="comment">
                        <tag>抢购</tag>仅剩{{item.transformed.tipInfo}}件
                    </p>
                    <p v-if="item.productType == 'groupon' && item.state == 1" class="comment">
                        <tag>团购</tag>{{item.transformed.tipInfo}}人已参团
                    </p>
                </div>
            </product>
        </slider>
        <pagination v-if='pageType' :class="pageType"></pagination>
    </swiper>
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
            'mask': comps.Product.Mask,
            'ctitle': ctitle,
            'tag': comps.Tag.Solid,
        },
        computed: {
            width: function () {
                return this.options.wrapperWidth/this.options.perSliders
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
.daily-goods.double {
    background-color: @white;
    .swiper {
        padding: .1rem .1rem 0 .1rem;
    }
    .product {
        .container {
            &.img {
                margin: .4rem .4rem .3rem .4rem;
                img {
                    //height: 100%;
                }
            }
            &.content {
                padding: 0 .16rem .16rem .16rem;
                .name {
                    .flexitem(1);
                    .set-ellipsis-line(2);
                    .set-line-height(2;@font-nm-sm + .06rem;);
                    padding: 0;
                    font-size: @font-nm-sm;
                    color: @gray-dark;
                }
                strong {
                    margin-bottom: .08rem;
                    .set-line-height(1;.5rem);
                    font-size: @font-lg-sm;
                    color: @red;
                    margin-right: .1rem;
                }
                del {
                    color: @gray-light;
                    font-size: @font-sm;
                }
                .comment {
                    display: block;
                    color: @gray-light;
                    font-size: @font-sm;
                    .set-line-height(1;@font-sm + .04rem);
                    .tag {
                        margin-right: .06rem;
                        &.overseas {
                            background-color: #8c2d99;
                            border-color: #8c2d99;
                        }
                    }
                }
            }
        }
    }
}
</style>
