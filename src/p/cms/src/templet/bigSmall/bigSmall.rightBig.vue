//bigSmall.rightBig.vue
<template>
    <ctitle :data="data"></ctitle>
    <big-small  :class="[borderStyle(data.borderDisplay), paddingStyle(data.templatePadding)]">
        <a class="react big" :href="data.bigImgList[0].href" slot="right">
           <img  v-lazyload="data.bigImgList[0].imageUrl">
       </a>
       <a class="react" :href="item.href" v-for="item in data.smallImgList" slot="left">
           <img  v-lazyload:rect="item.imageUrl">
       </a>
       <div class="bigsmall rest" v-for="item in data.doubleList" track-by="$index" slot="rest">
           <a class="react" :href="item[0].href">
               <img v-lazyload:rect="item[0].imageUrl" >
           </a>
           <a class="react" :href="item[1].href">
               <img v-lazyload:rect="item[1].imageUrl" >
           </a>
       </div>
    </big-small>
</template>
<script>

import comps from 'components'
import styleMixin from '../../utils/style.mixin.vue';
import ctitle from '../title/ctitle.vue'
export default(
    Vue.extend({
        mixins: [styleMixin],
        components: {
            'big-small': comps.BigSmall,
            'ctitle': ctitle
        }
    })
)
</script>