<template>
	<div class="elastic-layer" v-show="isShow">
            <div class="layer-con">
                <img class="layer-top" v-show="isEmpty" src="./images/empty_layer.png">
                <img class="layer-top" v-else src="./images/win_layer.png">
                <div class="mid-layer">
                    <p class="prize-tips">{{data.tips}}</p>
                    <a class="btm-btn-sure" href="javascript:;" @click="onClick"><img src="./images/sure_btn.png"></a>
                </div>
            </div>
        </div>
</template>
<script>
	export default({
		props:['data'],
		data:function(){
			return{
				isShow:false,
                isEmpty: false,
			}
		},
		methods:{
			onClick:function(){
				this.$set('isShow',false)
			}
		},
        created: function(){
            this.$watch('data', function(data){
                if(data.couponValue == 0){
                    this.$set('isEmpty', true)
                }else{
                    this.$set('isEmpty', false)
                }
            })
        },
		events:{
			isLayerShow:function(isLayerShow){
				this.$set('isShow',isLayerShow)
				return
			}
		}
	})
</script>
<style lang="less">
	@import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    @content-bg:#ffefef;
    @content-color:#40220f;
    .elastic-layer{
        z-index: @z-max;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.7);
        .layer-con{
	        position: absolute;
	        top: 20%;
	        left: 0;
	        -webkit-transform: translateY(-20%);
	        -moz-transform: translateY(-20%);
	        transform: translateY(-20%);
	    }
	    .mid-layer{
	        width: 55%;
	        margin: auto;
	        background: @content-bg;
	        border-bottom-left-radius: .1rem;
	        border-bottom-right-radius: .1rem;
	        padding: .7rem .5rem .3rem .5rem;
	        margin-top: -1rem;      
	        color: @content-color;
	        font-size: (@font-nm - 0.02rem);
	        box-sizing: border-box;
	        text-align: center;
	        word-break: break-all;
	        line-height: 1.5;
	    }
	    .btm-btn-sure{
	        width: 60%;
	        max-width: 1.88rem;
	        display: block;
	        overflow: hidden;
	        margin: auto;
	        margin-top: .3rem;
	    }
    }
</style>