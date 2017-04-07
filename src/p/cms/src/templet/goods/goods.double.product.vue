/**
 * 双列商品 图片信息部分
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
<template>
    <product v-if="data" :data="data"  :options="options" :width='width' >
        <!-- 角标 -->
        <!--短描述，但如果是专享的则优先显示短描述-->
        <product-tag v-if="data.shortWord" :class="tagFontLength" slot="tag">{{data.shortWord}}<i name="triangle"></i></product-tag>
        <!--其他的有短描述则显示短描述，无则显示商品类型-->
        <product-tag v-if="!data.shortWord && data.productType == 'groupon'" :class="tagFontLength" slot="tag">团购<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.productType == 'rushbuy'" :class="tagFontLength" slot="tag">抢购<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.productType == 'exclusive'" :class="tagFontLength" slot="tag">掌上专享<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.productType == 'vip' && !data.rebatePriceDesc" :class="tagFontLength" slot="tag">会员专享<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.rebatePriceDesc && data.productType != 'exclusive'" :class="tagFontLength" slot="tag">返利<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.productType == 'presell'" :class="tagFontLength" slot="tag">预售<i name="triangle"></i></product-tag>
        <product-tag v-if="!data.shortWord && data.productType == 'nomoney'" :class="tagFontLength" slot="tag">白拿<i name="triangle"></i></product-tag>
        <!-- 商品状态 -->
        <mask v-if="data.state > 1 && (data.productType == 'groupon' || data.productType == 'rushbuy')" slot="mask" >{{data.productState}}</mask>
        <!-- 抢购时间 -->
        <div v-if="data.state == 0" class="mask timer"  slot="mask-bottom-bar">
            未开始
        </div>
        <div v-if="isTimerShow" class="mask timer" slot='mask-bottom-bar'>
            距结束:<timer :time-start="data.start" :time-end="data.end"><timer>
        </div>
        <!-- 比价 -->
        <smartbuy v-if="data.productType == 'normal' && type != 'default'" v-show="data.compare.competitorPrice" slot="mask-bottom-bar" :data="data"></smartbuy>
        <content :show-cart-flag="showCartFlag" :show-button-flag="showButtonFlag"  slot="content" :data="data"></content>
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
 * 商品信息部分
 */
import content from './goods.double.content.vue'
/**
 * 比价
 */
import smartbuy from './goods.smartbuy.vue'
export default ({
    props: ['store','idx','options','pageInfo','width','type','showCartFlag','triangleTagStyle','showButtonFlag','triangleTagStyleDouble'],
    components: {
        'product': comps.Product.Default,
        'product-tag': comps.ProductTag,
        'content': content,
        'timer': comps.Timer.Under3,
        'mask': comps.Product.Mask,
        'smartbuy': smartbuy
    },
    data: function(){
        return {
            isTimerShow: false,
            tagFontLength:{},
            data: {}
        }
    },
    created: function(){
        this.$set('data', this.store.goodsList[this.idx].transformed)
        /**
         * 右上角标
         * 背景样式设置
         * 默认第一种
         * triangleTagStyle 对应2、3种角标
         * triangleTagStyleDouble 带标签双列模块对应的2、3角标
         */
        if(this.triangleTagStyle == 0 || this.triangleTagStyleDouble == 0){
            this.tagFontLength.none = true;
        }else if(this.triangleTagStyle == 2 || this.triangleTagStyleDouble==2){
            this.tagFontLength.flag = true;
        }else if(this.triangleTagStyle == 3 || this.triangleTagStyleDouble == 3){
            this.tagFontLength.rectangle = true;
        };
        /**
         * 字数样式设置
        */
        if(this.data.shortWord){
            this.tagfontSize(this.trueLength(this.data.shortWord));
        }else if(this.data.tagContent){
            this.tagfontSize(this.trueLength(this.data.tagContent));
        }
        if(this.data.productType == 'rushbuy' || this.data.productType == 'groupon'){
            /*
             * 初始化判断
             */
            if(!!this.data.end && this.data.start < this.data.end && this.data.state == 1){
                this.isTimerShow = true
            }
            /*
             * 刷新状态
             */
            this.$watch('data.end',function(val){
                this.isTimerShow = true
                this.data.state = 1
            })
        }
    },
    events: {
        timerEnd: function(){
            this.data.state = 3
            this.isTimerShow = false
        },
    },
    methods: {
        isChinese: function(char){
            var re=/[^\u0000-\u00FF]/;
            if (re.test(char)) return true;
            return false;
        },
        trueLength: function(str){
            var length = 0
            for(var key in str){
                if(typeof str[key] == 'string')
                    length += this.isChinese(str[key]) ? 1 : 0.5
            }
            return Math.ceil(length)
        },
        tagfontSize: function(font){
            var tagFontLengthArray = ['one','two','three','four','five','six'];
            this.tagFontLength[tagFontLengthArray[font-1]]= true;
        }
    }
})
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
@import 'goods.less';
@img-padding: .2rem;
.list.product-list {
    background: inherit;
    &.col2 {
        padding: @templet-margin-full;
        .goods-in-list(2);
        .flexgrid{
            &:not(:last-child){
                margin-bottom: .1rem;
            }
        }
        .product,
        .blocker {
            background: inherit;
            margin-left: .05rem;
            a.react{
                background: #fff;
            }
            .tag-product {
                right: 0;/* -1 * @img-padding */
                top: 0;
                font-size: @font-nm - .02rem;
                background: -webkit-linear-gradient(left,#ef3031, #ff1d67);
                width: .74rem;
                height: .74rem;
                line-height: .7rem;
                letter-spacing:0;
                padding: 0 .02rem;
                border-radius: 0;
                &.none{
                    display: none;
                }
                i{
                    position: absolute;
                    bottom: -0.1rem;
                    left: 0;
                    display: block;
                    border: 0.1rem solid transparent;
                    border-left: .1rem solid #f02f32;
                }
                &.rectangle{
                    min-width: 1.1rem !important;
                    width: auto !important;
                    height: .32rem;
                    line-height: .32rem !important;
                    padding: 0 .06rem;
                    padding-top: 0 !important;
                    font-size: @font-nm - .02rem !important;
                    i{
                        display: none;
                    }
                }
                &.flag{
                    width: .74rem;
                    height: .8rem;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABQCAYAAAC6aDOxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMmVkMzJlNC04NDM5LTQ2YjEtYWNlYS1hYzQyOTE2MzQwMTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTJDM0VFRENBMTdCMTFFNkEzMkFFOTJENzMxMzQzREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTJDM0VFREJBMTdCMTFFNkEzMkFFOTJENzMxMzQzREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMzY0ODRlNy0xYzBmLTRlOTEtOWQ3Mi00ZWZjMmQ1ZWUxZjgiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMzM4NDIzYS0zMDg5LTExNzktYjk0Zi05ODc5YzZiNGExNWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7SZXQAAAAD3ElEQVR42uzcz2vUQBQH8JlRFC2IIKIH8SAoetFaPHgQBD2o9Qf4oyf/wrZUEQQVFDyIBw+CIOjBg+BBBKGI6Kqo8Ztkssm896bbH9mlyHdhd7LzZncmnyZ5s9lt/I8jVwvnvKtuRSzjc5+pH8YLXVeVRee1RiyNypjRfybuZKvC6lM/96qt1b6+hbrP2LNvRtDU2vXDuNd1Uad9rRFLozJm9J+JO9nKW33q54Vqa7WPQG0HRLKQQtoBkWT70O2MSDoeZGdESuPB6oxIbW3IDYZIVponkkLSaZ5ICZKd5ok0RArdFSOSRgpyxYhkzYOIlEUKLrPCRIrzoEIOlkj6wyqR8kjDLEYkGynJYkTSSCqLEUl91NArRqTko4aNQaTmo4YxUCK1rULhnSNSHqk+3UGkLFJ7uoNIJlJykCaSjquDNJHSeLA6JlIbDy7TMZHqeH26g0hZpPZ0B5FMpJAMmUiq/5CexSeS7D/orzqIJOZBhSNSflyZNE+kdh6UhSBSnAelDYmUxkK3ayJppOCSoRBJIoW0UyJJJJXmiZQimWmeSO36xW9WiZRD6nyzSiSXS/NEyiMZvw8ikn3CjEgmUtBfthKpi6RPmBEpQRLzICIZaV4iEEmkeQuBSJnfSRNJIgU1eyRSghScNcUm0hBJ/EMdkSRSkKtHJHmQ9oUjUh5J/NKeSLK+zWJEMpHSLEYkhaR+vECkFElPFImURDtARLKQwkr/8Usk6xhEJJnFDJTJIn1DOY8nN1HuQ3kb9yW8x2AzIPnlEzPicmcrXPys8J0a44JqRVrv5QXg2vgA5QOU83h2H8vfnb5g3BTus3iPW4hdRt1UOh7f+cdA2Y/P9O/FyOwLzCVruTx9svqTTADpJx4eIo6txQPFfU3fxTtnXlWveo8diF10JZZzV1DumhRSDRRfOAakX7g/xjuXu9A91H3RiKtGamLb8XABJXZJdw3l7nEitUD9If3GwxN0tIDlu1heHrG7rQepqdmGh/Mo54AELLend6QEaP1If/D4FItAcXew/HmNx6SNIDXlViCdqw/2/jrKvX0gAWi6UAirQ/qL+zO0LXefJdR82uCBuw+k5pi0BctnI9YNlPvXixSBDAQbqWz7vN5S/CLKjz1ntz6RmjpMZfwZlMiG1ZZ1YC1IHaAsUhl/0UH5MOYpwDiQWqzCny63LF9nxIOjkARQMoCX5TwFL1xAzfsJz5PGidSM06PFKZRzMSMespAk0Ku4pZQH23c9Z7fNiOR2vnlUlYNjl2biblhuWYc7aX76NcrFamtx7u2I3e2/Q2qAurfB0dnjFRZ2w38CDAAdEmJSKm79gQAAAABJRU5ErkJggg==);
                    background-size: 100% 100%;
                    i{
                        display: none;
                    }
                    &.four{
                        padding-top: .06rem;
                    }
                }
                &.three{
                    font-size: @font-sm + 0.02;
                }
                &.four{
                    line-height: .28rem;
                    padding-top: .08rem;
                }
                &.five{
                    font-size: @font-sm + 0.02;
                    line-height: .25rem;
                    padding-top: .12rem;
                }
                &.six{
                    font-size: @font-sm + 0.02;
                    line-height: .25rem;
                    padding-top: .12rem;
                }
            }
            /* padding: @img-padding; */
            &:nth-child(1){
                margin-right: .05rem;
                margin-left: 0;
                /* border-right: @border-nm; */
            }
            .flexitem(1);
            .container {
                &.img {
                    .mask{
                        &.timer {
                            background-color: rgba(0,0,0,.6);
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            .set-line-height(1,@font-lg);
                            text-align: center;
                            font-size: @font-nm-sm;
                            color: @white;
                            z-index: @z-mid;
                        }
                    }
                    .info-compare {
                        width: 100%;
                        position: absolute;
                        overflow: hidden;
                        z-index: @z-max;
                        bottom: 0;
                        text-align: center;
                    }
                }
            }
            .content{
                margin: 0 .14rem;
                margin-bottom: .2rem;
            }
        }
    }
}
</style>
