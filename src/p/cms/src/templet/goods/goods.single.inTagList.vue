//goods.single.vue
<template>
    <title v-if="data.displayName">{{data.displayName}}</title>
    <list-col1>
      <product :show-cart-flag="showCartFlag"  v-for="item in data.goodsList" :data="item.transformed" :page-info='pageInfo' :options="options"></product>
   </list-col1>
</template>
<script>
import Transformer from '../../utils/dataTransformer.js'
import comps from 'components'
import product from './goods.single.inTagList.product.vue'
import title from '../title/title.vue'
import mixin from './goods.mixin.vue'
export default (
    Vue.extend({
        props: ['showCartFlag'],
        mixins: [mixin],
        data: function(){
            return {
                type: 'default'
            }
        },
        components: {
            'list-col1': comps.ListCol1,
            'product': product,
            'title': title,
        },
        created: function(){
            //不用判断type==default
            //因为总在列表里
            this.$watch('data.goodsList',function(val){
                this.transTime(val, this.data.templetType, this.data.templetId)
            })
        }
    })
)
</script>
<style lang="less">

</style>
