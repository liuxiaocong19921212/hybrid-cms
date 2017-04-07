//floorPhoto.default.vue
<template>
    <ctitle :data="data"></ctitle>
    <floor-photo  class="col" :class="[colNumber, borderStyle(data.borderDisplay), paddingStyle(data.templatePadding)]" v-bind:list="data.imgList"></floor-photo>
</template>
<script>
    import comps from 'components';
    import styleMixin from '../../utils/style.mixin.vue';
    import ctitle from '../title/ctitle.vue';
    export default (
        Vue.extend({
            mixins: [styleMixin],
            components: {
                'floor-photo': comps.FloorPhoto,
                'ctitle': ctitle
            },
            data: function(){
                return {
                    colLength: 1,//can be 1 2 3
                }
            },
            computed: {
                colNumber: function(){
                    return 'col' + this.colLength
                }
            }
        })
)
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
    .floorphoto {
        &.no-border {
            border:  none;
            .rows {
                border: none !important;
            }
            a {
                border: none !important;
            }    
        }
        &.all-border {
            border-top: @border-nm;
            border-bottom: @border-nm;
        }
        &.inside-border {
            //this is our default situation
        }
        &.top-border {
            border-top: @border-nm;
        }
        &.bottom-border {
            border-bottom: @border-nm;
        }
        &.has-padding {
            margin: 0 .2rem;
        }
    }
</style>
