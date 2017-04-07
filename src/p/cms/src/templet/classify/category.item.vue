<template>
	<li  @click = 'onClick'
        :class = '{active : isActive}'>
		<slot></slot>
	</li>
</template>
<script>
	export default(
		Vue.extend({
			props: ['content','idx'],
			data:function(){
				return{
					isActive: false
				}
			},
			events: {
				reset:function(){
					this.isActive = false
				},
				setActive:function(){
					if(this.idx == idx){
						this.$dispatch('clickOne',this.idx)
						this.isActive = true
					}
				}
			},
			methods:{
				onClick:function(){
					this.$dispatch('clickOne',this.idx);
					this.isActive = true
				}
			},
			created:function(){
				if(this.content.isActive)
					this.isActive = this.content.isActive
				if(!!this.isActive){
					this.$dispatch('clickOne',this.idx)
					this.isActive = true
				}
			}
		})
	)
</script>
<style lang="less">
	@import '../../../../../b/components/src/core/less/layout.less';
	@import '../../../../../b/components/src/core/less/utils.less';
	.type-list{
		li{
			height: 0.96rem;
		    line-height: 0.96rem;
		    text-align: center;
		    font-size: 0.28rem;
		    color: #333;
	        border-left: .06rem solid transparent;
			&:not(:last-child) span{
				border-bottom: 1px solid #d3cccc;
			}
			span{
				display: block;
			    margin: 0 .2rem;
			}
			&.active{
				background: #fff;
				border-left: .06rem solid #ef3030;
			}
		}
	}
</style>