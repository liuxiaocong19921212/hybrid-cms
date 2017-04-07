/**
 * 商品模板
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
<template>
    <product v-if="data" :data="data"  :options="options" :width='width'>
        <!--角标-->
        <!--短描述，但如果是专享的则优先显示短描述-->
        <tag v-if="store.superscriptStyle != 0 && data.shortWord && data.productType != 'exclusive'" slot="tag">{{data.shortWord}}</tag>
        <!--其他的有短描述则显示短描述，无则显示商品类型-->
        <tag v-if="store.superscriptStyle != 0 && !data.shortWord && data.productType == 'groupon'" slot="tag">团购</tag>
        <tag v-if="store.superscriptStyle != 0 && !data.shortWord && data.productType == 'rushbuy'" slot="tag">抢购</tag>
        <tag v-if="store.superscriptStyle != 0 && !data.shortWord && data.productType == 'exclusive'" slot="tag">掌上专享</tag>
        <tag v-if="store.superscriptStyle != 0 && !data.shortWord && data.productType == 'presell'" slot="tag">预售</tag>
        <!--倒计时-->
        <div v-if="isTimerShow" class="mask timer" slot='mask-bottom-bar'>
            距结束<timer :time-start="data.start" :time-end="data.end" ></timer>
        </div>
        
        <!--商品内容-->
        <content slot="content" :data="data" :show-cart-flag="showCartFlag" v-ref:content>
        </content>
    </product>
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
     * 商品内容组件
     */
    import content from './goods.treble.content.vue'
   
    /**
     * 组件
     */
    export default ({
        props: ['store','options','pageInfo','width','type','idx','showCartFlag'],
        components: {
            'product': comps.Product.Default,
            'content': content,
            'timer': comps.Timer.Under3,
            'mask': comps.Product.Mask,
            'tag':comps.ProductTagGradient,
        },
        data: function(){
            return {
                isTimerShow: false,
                data: null,
            }
        },
        created: function(){
            //目前观察了下，在自组件里，父组件的数据发生变化时
            //当父组件$set后，父组件开始监控空数据
            //但是自组件并没有开始监控
            //需要子组件在初始化的时候强制监控一下才能实现父子监控联动
            this.$set('data',this.store.goodsList[this.idx].transformed)

            if(this.data.productType == 'rushbuy' || this.data.productType == 'groupon'){
                if(this.data.state == 1){
                    if(!!this.data.end && this.data.start < this.data.end){
                        this.isTimerShow = true
                    }
                }
            }
        },
        events: {
            //timer自己发出的事件
            timerEnd: function(){
                this.data.state = 3
                if(this.data.productType == 'groupon' || this.data.productType == 'rushbuy'){
                    this.data.productState = '已结束'
                    this.isTimerShow = false
                }
            }
        },
    })

</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
@import 'goods.less';
@img-padding: .1rem;
.list.col3.product-list{
    padding: @templet-margin;
    .goods-in-list(3);
    .flexgrid:not(:last-child) {
        margin-bottom: .06rem;
    }
    .product,
    .blocker {
        margin-right: .06rem;
        &:last-child {
            margin-right: 0;
        }
        padding: 0 .1rem;
        .tag-linear {
            margin-right: -@font-sm*0.5;
            margin-top: -@font-sm*0.5;
        }
        .container {
            &.img {
                margin: .1rem 0 .14rem;
                .mask{
                    &.timer {
                        background-color: rgba(0,0,0,.8);
                        position: absolute;;
                        bottom: 0;
                        width: 100%;
                        .set-line-height(1,@font-lg);
                        text-align: center;
                        font-size: @font-nm-sm;
                        color: @white;
                        z-index: @z-mid;
                    }
                }
            }
        }
    }
}

</style>
