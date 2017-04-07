/**
 * 双列商品
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
 <template>
    <!-- 标题 -->
    <ctitle :data="data"></ctitle>
    <!-- 双列 -->
    <list-col2 :class-name="'product-list'" :style="{'background':data.goodsBackColor}">
       <flexgrid v-if="data && index%2 == 0" v-for="(index, item) in data.goodsList">
            <!-- 左边商品 -->
           <product 
                :triangle-tag-style-double="triangleTagStyle" 
                :triangle-tag-style="data.superscriptStyle" 
                :show-button-flag="data.showButtonFlag || showButtonFlag" 
                :show-cart-flag="showCartFlag" 
                :store="data"
                :idx="index"
                :options="options" 
                :type="type"></product>
           <!-- 右边商品 -->
           <product 
                v-if="data.goodsList[index+1]" 
                :triangle-tag-style-double="triangleTagStyle" 
                :triangle-tag-style="data.superscriptStyle" 
                :show-button-flag="data.showButtonFlag || showButtonFlag" 
                :show-cart-flag="showCartFlag" 
                :store="data"
                :idx="index+1"
                :options="options" 
                :type="type"></product>
           <div class="blocker" style="visibility:hidden" v-else></div>
       </flexgrid>
   </list-col2>
</template>
<script>
    /**
     * 数据转换器
     */
    import Transformer from '../../utils/dataTransformer.js'
    /**
     * 双列商品
     */
    import product from './goods.double.product.vue'
    /**
     * 组件库
     */
    import comps from 'components'
    /**
     * 标题模块
     */
    import ctitle from '../title/ctitle.vue'
    /**
     * 商品的价格处理器
     */
    import mixin from './goods.mixin.vue'
    import {Config} from 'components'
    export default (
    Vue.extend({
        mixins: [mixin],
        props: ['triangleTagStyle'],
        components: {
            'list-col2': comps.ListCol2,
            'flexgrid': comps.Flexgrid,
            'product': product,
            'ctitle': ctitle
        },
        data: function(){
            return {
                width: document.body.offsetWidth/2,
                type: 'default'
            }
        },
        created: function(){
            this.$watch('data.goodsList',function(val){
                this.transTime(val, this.data.templetType, this.data.templetId)
                //在带标签里时，需要比价
                //***去掉 聪明购 比价 标记 2016/11/02/***
                // if(this.type != 'default')
                //     this.buyingSmart();
            })
            if(this.type == 'default'){
                if(window.appVersion < 63 && navigator.userAgent.match(/Android/i) && !Config.platform.wap){
                    this.getPriceStatus()
                }else{
                    //this.transTime(this.data.goodsList, this.data.templetType, this.data.templetId)
                }
            }
        }
    })
)
</script>
<style lang="less">
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';

</style>
