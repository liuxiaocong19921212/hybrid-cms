<template>
    <mtitle class="rushbuy-title" v-if="data.goodsList.length >= 6 && !hide">
        <strong v-if="data.displayName" :style="{color: data.displayColor}">
            {{data.displayName.substring(0,4)}}
        </strong>
        <timer v-if="data.countDown == 'Y'" slot="subtitle" :time-left="endTime - now"></timer>
        <a v-if="data.templetPromo" :href="data.promsUrl || 'javascript:;'"  class='subtitle right' slot="subtitle2"><span>{{data.templetPromo}}</span><i>&#x00A3</i></a>
    </mtitle>
    <scroller v-if="data.goodsList.length >= 6 && !hide" :options="options" :class="'daily-goods rushbuy'">
        <product 
                v-for="(index, item) in data.goodsList"
                v-if="index <= 14"
                :data="item.transformed"
                :width="width">
            <mask slot="mask" v-if="item.transformed.state > 1">{{item.transformed.productState}}</mask>
            <tag
                v-if="item.promoWord" 
                class="img-tag" 
                slot='mask-bottom-bar'>
                {{item.promoWord.substring(0,3)}}
            </tag>
            <div slot="content">
                <div class="price">
                    <strong>&yen;{{item.transformed.price}}</strong><del v-if="Number(item.transformed.price) < Number(item.transformed.originPrice) && item.transformed.originPrice">&yen;{{item.transformed.originPrice}}</del>
                </div>
                <!--<p v-if="item.goodsType == 0 && item.transformed.commentNum" class="comment">{{item.transformed.commentNum}}人评论</p>-->
                <!--<p v-if="item.goodsType == 28" class="comment">
                    <tag :class="'overseas'">海外购自营</tag>
                </p>-->
                <p v-if="item.transformed.productType == 'rushbuy' && item.transformed.state == 1" class="comment">
                    <span class="info">{{item.goodsBean.priceBean.remainNumDesc}}</span>
                </p>
                <p v-if="item.transformed.productType == 'groupon' && item.transformed.state == 1" class="comment">
                    <span class="info">{{item.transformed.tipInfo}}人已参团</span>
                </p>
            </div>
        </product>
        <more></more>
    </scroller>
</template>
<script>
import comps from 'components'
import title from '../title/title.vue'
import priceGetter from '../goods/goods.mixin.vue'
import base from './dailyGoods.mixin.js'
export default(
    Vue.extend({
        mixins: [priceGetter,base],
        components: {
            'timer': comps.Timer.Under3,
            'scroller': comps.Scroller,
            'product': comps.Product.Default,
            'tag': comps.Tag.Solid,
            'mtitle': title,
            'mask': comps.Product.Mask,
            'more': comps.ScrollerMore
        },
        data: function(){
            return {
                hide: false,
                now: window.serverCurTime,
                startTime: '',
                endTime: ''
            }
        },
        created: function(){
            this.startTime = new Date(this.data.startDate.replace(/-/g,'/')).getTime()
            this.endTime = new Date(this.data.endDate.replace(/-/g,'/')).getTime()
            if(this.now - this.startTime < 0){
                this.hide = true
            }
        },
        events: {
            timerEnd: function(){
                this.hide = true
            },
            jump: function(){
                window.jump(this.data.promsUrl)
            }
        }
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
.rushbuy-title.cms-title {
    .set-line-height(1; .80rem;);
    border: none;
}
.rushbuy-title {
    font-size: @font-size-title;
    strong {
        margin-right: .2rem;
    }
    .timer {
        .flexitem(1);
        font-size: @font-nm-sm;
        .time {
            padding: (@font-size-title - @font-nm-sm) / 2;
            border: 1px solid @gray-border;
            border-radius: .04rem;
            &.day {
                margin-right: @font-nm-sm / 2;
            }
        }
        .time,
        i {
            color: @red;
        }
        i {
            padding: 0 .05rem;
        }
    }
    .subtitle {
        font-size: @font-nm-sm;
        i {
            .icon-font();
            -webkit-transform: translateY(-2.5%);
            color: @red;
        }
    }
}
.daily-goods.rushbuy {
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
    .product {
        width: auto;
        margin-bottom: 0;
        a.react {
            margin-bottom: .15rem;
        }
        .container {
            text-align: center;
            .mask {
                z-index: @z-nm + 10;
            }
            .img-tag {
                position: absolute;
                z-index: @z-nm;
                left: 0;
                bottom: 0;
                border-radius: 0;
            }
            &.img {
                margin: .15rem;
                width: 1.6rem;
            }
            &.content {
                margin-bottom: .08rem;
                .name {
                    margin-bottom: .08rem;
                    .flexitem(1);
                    .ellipsis-line(1);
                    .set-line-height(1;@font-nm-sm);
                    padding: 0;
                    font-size: @font-nm-sm;
                    color: @gray-dark;
                }
                .price {
                    margin-top: .1rem;
                    strong {
                        color: @gray-dark !important;
                    }
                }
                strong {
                    display: inline-block;
                    margin-right: @font-sm * 0.5;
                    .set-line-height(1;@font-nm);
                    font-size: @font-nm;
                    color: @red;
                }
                .tag {
                    margin-right: .06rem;
                }
                .info {
                    font-size: @font-sm;
                    color: @gray-light;
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
