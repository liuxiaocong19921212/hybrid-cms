<template>
    <product v-if="data" :data="data"   :options="options" :width='width'>
        <mask slot="mask" v-if="data.state != 1 && (data.productType == 'groupon' || data.productType == 'rushbuy')">{{data.productState}}</mask>
        <content  :triangle-tag-style="triangleTagStyle" :show-cart-flag="showCartFlag" :show-button-flag="showButtonFlag"  :compare="compare" slot="content" :data="data"></content>
    </product>
</template>
<script>
import Transformer from '../../utils/dataTransformer.js'
import comps from 'components'
import content from './goods.single.content.vue'
export default ({
    props: ['store','idx','options','pageInfo','width','showCartFlag','showButtonFlag','triangleTagStyle'],
    components: {
        'product': comps.Product.Default,
        'product-tag': comps.ProductTag,
        'product-tag-price': comps.ProductTagPrice,
        'content': content,
        'timer': comps.Timer,
        'mask': comps.Product.Mask
    },
    data: function(){
        return {
            //width: '20rem',
            compare: {
                competitor: '',
                competitorPrice: 0,
                discountPrice: 0
            },
            data: {}
        }
    },
    created: function(){
        //建立数据绑定
        this.$set('data', this.store.goodsList[this.idx].transformed)
    }
})

</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
@import 'goods.less';
.list.product-list {
    &.col1 {
        padding: @templet-margin-full;
        .product {
            width: inherit;
            margin-bottom: .08rem;
            a.react {
                .flexbox();
                .img {
                    &.container {
                        /*.mask {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            .flexbox();
                            .flexbox.center();
                            z-index: @z-mid;
                            .content {
                                width: 1.16rem;
                                .set-line-height(1;1.16rem;);
                                color: @white;
                                background-color: rgba(0,0,0,0.3);
                                border-radius: 100%;
                                text-align: center;
                            }
                        }*/
                        img {
                            width: 2.5rem;
                            height: 2.5rem;
                        }
                        margin-right: .2rem;
                    }
                }
                .content {
                    &.container {
                        .flexitem(1);
                        padding-top: .18rem;
                        padding-right: .2rem;
                    }
                }
            }
        }
        .product {
            .tag-product {
                border-width: .5rem !important;
            }
            .tag-content {
                top: .11rem;
                right: .01rem;
                font-size: .14rem;
                letter-spacing: .02rem;
            }
        }
    }
}
</style>
