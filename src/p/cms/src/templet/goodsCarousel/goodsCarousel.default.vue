//goodsCarousel.default.vue
<template>
    <title v-if="data.displayName">{{data.displayName}}</title>
    <list-col1>
       <product :data="data.goodsList[0].transformed" :options="options"></product>
   </list-col1>
</template>
<script>
import comps from 'components'
import title from '../title/title.vue'
export default (
    Vue.extend({
        components: {
            'list-col1': comps.ListCol1,
            'product': comps.Product.SwiperSingle,
            'title': title,
        }
    })
)
</script>
