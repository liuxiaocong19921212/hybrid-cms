/**
 * 三列商品入口
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
<template>
    <div class="treblelist">
        <!--整体模块的标题-->
        <!--<div v-if="data.displayName || data.backImgUrl" class="title" :style="titleBGStyle">-->
            <!--标题背景图-->
            <!--<img  src="data:image/gif;base64,R0lGODlhAwABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ODc5MkU1OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ODc5MkU2OTNGRjExRTVBMEVCRkM1QUU0NjlGREE4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk4NzkyRTM5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk4NzkyRTQ5M0ZGMTFFNUEwRUJGQzVBRTQ2OUZEQTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAAwABAAACAoQLADs="
            v-if="data.backImgUrl" v-lazyload='data.backImgUrl'>-->
            <!--可配置图片标题模式-->
            <!--<div v-if="(data.backImgUrl && data.displayName) || (data.displayName && !data.templetPromo)" class="text" :class="[data.backImgUrl ? 'with-bg' : 'without-bg']">
                <h3 :style="titleStyle">
                    <hr :style="borderStyle"/>{{titleContent}}<hr :style="borderStyle"/>
                </h3>
            </div>-->
            <!--文字标题模式-->
            <!--<div v-if="!data.backImgUrl && data.templetPromo" class="product-title">
                <p :style="titleStyle" class="title-content">{{titleContent}}</p>
                <a :style="titleStyle" class="go">
                    {{titlePromo}}<icon class="go-icon"><span slot="icon" data-icon="&#x00a3" class="go-arrow"></span></icon>
                </a>
            </div>
        </div>-->
        <ctitle :data="data"></ctitle>
        <!--商品列表-->
        <list-col3 :data="data" :style="goodsStyle" :class-name="'product-list'" >
            <!--每一行商品-->
           <flexgrid v-if="data && index%3 == 0" v-for="(index, item) in data.goodsList">

               <!--第一列商品-->
               <product 
                    :show-cart-flag="data.showCartFlag" 
                    :idx="index" 
                    :store="data"  
                    :options="options" 
                    :type="type"
                    :show-button-flag="data.showButtonFlag"></product>

               <!--第二列商品-->
                <product 
                    v-if="data.goodsList[index+1]" 
                    :idx="index+1" 
                    :show-cart-flag="data.showCartFlag" 
                    :store="data"   
                    :options="options" 
                    :type="type" 
                    :show-button-flag="data.showButtonFlag"></product>
               <!--第二列商品不存在时占位-->
               <div v-else class="blocker" style="visibility:hidden"></div>

               <!--第三列商品-->
               <product 
                    v-if="data.goodsList[index+2]" 
                    :idx="index+2" 
                    :show-cart-flag="data.showCartFlag" 
                    :store="data"  
                    :options="options" 
                    :type="type" 
                    :show-button-flag="data.showButtonFlag"></product>
               <!--第三列商品不存在时占位-->
               <div v-else class="blocker" style="visibility:hidden"></div>

           </flexgrid>
       </list-col3>
    </div>
</template>
<script>
    /**
     * 商品内容组件
     */
    import product from './goods.treble.product.vue'
    /**
     * 标题组件
     */
    import ctitle from '../title/ctitle.vue'
    /**
     * 组件库
     */
    import comps from 'components'
    /**
     * 商品的价格处理器
     */
    import mixin from './goods.mixin.vue'
    /**
     * 组件
     */
    export default (
    Vue.extend({
        mixins: [mixin],
        components: {
            'list-col3': comps.ListCol3,
            'flexgrid': comps.Flexgrid,
            'product': product,
            'icon': comps.Tag.Icon,
            'ctitle': ctitle,
        },
        data: function(){
            return {
                width: document.body.offsetWidth/3,
                type: 'default'
            }
        },
        computed: {
            /**
             * 标题颜色
             * @returns {style}
             */
            titleStyle: function(){
                return {
                    color: this.data.displayColor,
                }
            },
            /**
             * 标题背景颜色
             * @returns {style}
             */
            titleBGStyle: function(){
                return {
                    backgroundColor: this.data.displayBackColor,
                }
            },
            /**
             * 标题横线颜色
             * @returns {style}
             */
            borderStyle: function(){
                return {
                    borderColor: this.data.displayColor
                }
            },
            /**
             * 标题文字字数限制
             * @type {string}
             */
            titleContent: function () {
                return this.data.displayName.substring(0,10);
            },
            /**
             * 标题促销文字字数限制
             * @type {string}
             */
            titlePromo: function () {
                return this.data.templetPromo.substring(0,8);
            },
            /**
             * 商品背景颜色
             * @returns {style}
             */
            goodsStyle: function () {
                return {
                    backgroundColor: this.data.goodsBackColor,
                }
            }
        },
        created: function(){
            if(window.appVersion < 63 && $g.system.android && $g.env.hybrid){
                this.getPriceStatus()
            }else{
                this.transTime(this.data.goodsList, this.data.templetType, this.data.templetId)
            }    
        },

    })
)
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
.treblelist {
    .title {
        position: relative;
        color: @gray-dark;
        font-size: .3rem;
        text-align: center;
    }
    .text {
        &.without-bg {
            .set-line-height(1;.78rem;);
        }
        &.with-bg {
            position: absolute;
            height: 100%;
            top: 0;
        }
        width: 100%;
        .flexbox();
        .flexbox.center();
    }
    .product-title {
        height: @font-sm*3.9;
        line-height: @font-sm*3.9;
        padding: 0 @font-sm;
        .flexbox();
        .title-content {
            font-size: @font-lg-sm;
            color: @gray-dark;
            line-height: @font-sm*3.9;
            font-weight: bolder;
            text-align: left;
            .flexitem(1);
        }
        .go{
            font-size: @font-nm-sm;
            color: @gray-dark;
            .go-icon {
                width: @font-nm;
                height: @font-nm;
                line-height: @font-nm;
                border-radius: 50%;
                vertical-align: middle;
                text-align: center;
                border: 0;
                background-color: @white;
                opacity: .7;
                margin-left: .08rem;
                .go-arrow {
                    color: #000;
                }
            }
        }
    }
    hr {
        width: .6rem;
        border-bottom: 1px solid #333333;
        display: inline-block;
        transform: translateY(-.09rem);
        margin:0 .1rem;
    }
    .list {
        &.col3 {
            &.product-list {
                 padding: 0.1rem 0.2rem 0.1rem 0.2rem;
             }
         }
    }
}
</style>
