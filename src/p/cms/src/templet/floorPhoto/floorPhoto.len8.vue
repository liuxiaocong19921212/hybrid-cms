//floorPhoto.len8.vue
<template>
    <floor-photo  class="col" :class='colNumber' v-bind:list="data.imgList.slice(0,colLength/2)"></floor-photo>
    <floor-photo class="col" :class='colNumber' v-bind:list="data.imgList.slice(colLength/2,colLength)"></floor-photo>
</template>
<script>
    import Base from './floorPhoto.default.vue'
    export default (
        Base.extend({
            data: function () {
                return {
                    colLength: 8
                }
            }
        })
)
</script>