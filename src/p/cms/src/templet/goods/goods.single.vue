//goods.single.vue
<template>
    <ctitle :data="data"></ctitle>
    <list-col1 :class-name="'product-list'" :style="{'background':data.goodsBackColor}" >
      <product 
            v-for="(index, item) in data.goodsList" 
            :idx="index"
            :show-button-flag="data.showButtonFlag || showButtonFlag" 
            :show-cart-flag="data.showCartFlag || showCartFlag" 
            :triangle-tag-style="data.superscriptStyle || triangleTagStyle" 
            :store="data" 
            :page-info='pageInfo' 
            :options="options"></product>
   </list-col1>

</template>
<script>
import Transformer from '../../utils/dataTransformer.js'
import comps from 'components'
import product from './goods.single.product.vue'
import ctitle from '../title/ctitle.vue'
import mixin from './goods.mixin.vue'
export default (
    Vue.extend({
        mixins: [mixin],
        props:['triangleTagStyle'],
        data: function(){
            return {
                type: 'default'
            }
        },
        components: {
            'list-col1': comps.ListCol1,
            'product': product,
            'ctitle': ctitle
        },
        created: function(){
            if(window.appVersion < 63 && $g.system.android){
                this.getPriceStatus()
            }else{
                this.transTime(this.data.goodsList, this.data.templetType, this.data.templetId)
                //***去掉 聪明购 比价 标记 2016/11/02***
                //this.buyingSmart()
            }
        },
        events: {
            onPriceGet: function(){
                //***去掉 聪明购 比价 标记 2016/11/02***
                //this.buyingSmart()
            }
        }
    })
)
</script>
