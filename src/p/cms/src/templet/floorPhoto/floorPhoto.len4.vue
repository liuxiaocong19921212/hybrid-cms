//floorPhoto.len4.vue
<template>
    <floor-photo  class="col" :class='colNumber' v-bind:list="data.imgList"></floor-photo>
</template>
<script>
    import Base from './floorPhoto.default.vue'
    export default (
        Base.extend({
            data: function () {
                return {
                    colLength: 4
                }
            }
        })
    )
</script>