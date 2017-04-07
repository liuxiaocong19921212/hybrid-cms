<template>
    <mtitle v-if="!hide && data.couponList.length >= 2 && data.displayName" class="has-sub-title">
        <strong v-if="data.displayName" :style="{color: data.displayColor}">
            {{data.displayName.substring(0, 6)}}
        </strong>
        <a v-if="data.templetPromo" :href="data.promsUrl || 'javascript:;'" class='subtitle right'><span >{{data.templetPromo}}</span><i>&#x00A3</i></a>
    </mtitle>
    <scroller v-if="!hide && data.couponList.length >= 2" class="coupon-carousel" :options="options">
       <coupon v-for="item in data.couponList" :data="item" class="img-container"></coupon>
    </scroller>
</template>
<script>
    import comps from 'components'
    import Transformer from '../../utils/dataTransformer.js'
    import title from '../title/title.vue'
    import coupon from './coupon.vue'
    export default (
        Vue.extend({
            data: function(){
                return {
                    hide: false
                }
            },
            components: {
                'scroller': comps.Scroller,
                'mtitle': title,
                'coupon': coupon
            },
            created: function(){
                //判断显隐
                var startTime = this.data.startDate ? this.data.startDate.replace(/-/g,'/') :　null
                var start = new Date(startTime).getTime()
                var endTime = this.data.endDate ? this.data.endDate.replace(/-/g,'/') :　null
                var end = new Date(endTime).getTime()
                if(start && window.serverCurTime - start < 0){
                    this.hide = true
                }
                if(end && window.serverCurTime - end > 0){
                    this.hide = true
                }
            }
        })
    )
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
.has-sub-title.cms-title {
    .set-line-height(1; .8rem;);
}
.has-sub-title {
    strong {
        margin-right: .2rem;
        .flexitem(1);
        i {
            color: @red;
        }
        i {
            padding: 0 .05rem;
        }
    }
    .subtitle {
        font-size: @font-nm-sm;
        margin-right: .18rem;
        i {
            margin-left: .1rem;
            .icon-font();
            -webkit-transform: translateY(-3.5%);
            color: @red;
        }
    }
}
.coupon-carousel {
    .img-container {
        padding: .16rem .18rem .16rem 0;
        &:first-child{
            padding-left: .16rem;
        }
        &:last-child{
            padding-right: .16rem;
        }
        img {
            width: auto;
            height: 1.3rem;
        }
    }
}
</style>