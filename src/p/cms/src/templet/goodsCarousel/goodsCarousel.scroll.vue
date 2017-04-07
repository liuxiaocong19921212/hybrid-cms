//goodsCarousel.scroll.vue
<template>
    <title v-if="data.displayName">{{data.displayName}}</title>
    <swiper v-bind:options="options" v-bind:list="data.goodsList">
        <slider v-for="item in data.goodsList" track-by="$index" v-bind:options="options" slot="slider">
           <list-col1>
               <product :data="item.transformed" :options="options">
               </product>
           </list-col1>
        </slider>
        <pagination class="red block"></pagination>
    </swiper>
</template>

<script>
    import comps from 'components'
    import title from '../title/title.vue'
    export default (
    Vue.extend({
        components: {
            'swiper': comps.ListCol1,
            'product': comps.Product.SwiperSingle,
            'slider': comps.Slider,
            'list-col1': comps.ListCol1,
            'title': title,
        }
    }))
</script>
