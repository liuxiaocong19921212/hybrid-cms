//floorPhoto.len6.vue
<template>
    <floor-photo class="col" :class='colNumber' v-bind:list="[data.imgList[0],data.imgList[1]]"></floor-photo>
    <floor-photo class="col" :class='colNumber' v-bind:list="[data.imgList[2],data.imgList[3]]"></floor-photo>
    <floor-photo class="col" :class='colNumber' v-bind:list="[data.imgList[4],data.imgList[5]]"></floor-photo>
</template>
<script>
    import Base from './floorPhoto.default.vue'
    export default (
        Base.extend({
            data: function () {
                return {
                    colLength: 6
                }
            }
        })
)
</script>
