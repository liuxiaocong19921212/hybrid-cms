<template>
    <div class="prize" :class="[activeFX, index, is3Q]">
        <div class='content'>
            <span v-if="store.activityData.data.luckType == 'score' && prizeInfo">
                {{prizeInfo}}
            </span>
            <span v-if="store.activityData.data.luckType == 'order' && prizeInfo">
                {{prizeInfo}}
            </span>
            <span v-if="store.activityData.data.luckType == 'normal' && prizeInfo">
                {{prizeInfo}}
            </span>
        </div>
        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
    </div>
</template>
<script>
    import comps from 'components'
    export default ({
        props: ['idx','validIdx', 'store'],
        components: {
            cimg: comps.Image
        },
        data: function(){
            return {
                activeFX: '',
                prizeInfo: '',
                is3Q: '',
            }
        },
        created: function(){
            this.$watch('store.activityData.data', function(data){
                if(data.coupons[this.validIdx]){
                    this.prizeInfo = data.remarks[this.validIdx].remark.replace(/\.0+/,'')//val[this.validIdx]
                }else{
                    if(this.idx != 0 && this.idx != 5)
                        this.store.empties.push(this.idx);
                    this.is3Q  = 'thank-u'
                }
            })
            this.$watch('store.result.data',function(data){
                if( this.validIdx >= 0
                    && this.store.activityData.data.remarks[this.validIdx]
                    && data.couponType == this.store.activityData.data.remarks[this.validIdx].couponType
                    && data.remark == this.store.activityData.data.remarks[this.validIdx].remark
                    && data.couponValue == this.store.activityData.data.remarks[this.validIdx].couponValue ){
                    this.store.prizeIdx = this.idx
                }
            })
        },
        computed: {
            index: function(){
                return 'prize-' + this.idx
            }
        },
        events: {
            active: function(idx){
                if(idx == this.idx){
                    this.activeFX = 'active'
                }else{
                    this.activeFX = ''
                }
            },
            showPrize: function(validIdx, value){
                if(validIdx == this.validIdx){
                    this.prizeInfo = value.replace(/\.0+/,'')
                }
            }
        }
    })
</script>
<style lang='less'>
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    @import './game.less';
    .wheel.game-wrapper .game-container .game-content .row .block{
        padding: @block-padding;
        width:  33.3333%;
        .prize {
            color: @game-font-color-em;
            box-shadow: .02rem .03rem .03rem @shadow-color;
            background-color: @block-bg;
            border-radius: .2rem;
            overflow: hidden;
            position: relative;
            background-repeat: no-repeat;
            &.thank-u {
                background-image: url(./images/wheel_square_3q.png);
                background-size: auto 80% ;
                background-position: center;
            }
            &.prize-0 {
                background-image: url(./images/wheel_square_block1.png);
                background-size: auto 85% ;
                background-position: 30% 100%;
            }
            &.prize-5 {
                background-image: url(./images/wheel_square_block2.png);
                background-size: 100% auto;
                background-position: 100% 100%;
            }
            &.active {
                background-color: @active-bg;
            }
            .content {
                position: absolute;
                margin: 10%;
                height: 80%;
                width: 80%;
                .flexbox();
                .flexbox.center();
            }
        }
    }
</style>