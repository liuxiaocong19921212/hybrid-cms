<template>
	<div class="classify-wrapper">
		<div class="category" :style="{height:winHeight}">
			<div class="myscroller">				
				<category v-if="data" :list="data" v-ref:category></category>	
			</div>
		</div>
		<div v-if="data" class="product-list" :style="{height:winHeight}">
			<ul class="list">
				<product-item  :pd-list="pdlist" v-ref:productItem></product-item>
			</ul>
		</div>
	</div>
</template>
<script>
	import category from './calssify.category.vue'
	import productItem from './classify.product.vue'
	export default(
		Vue.extend({
			data:function(){
				return{
					winHeight:'',
					pdlist : {}
				}
			},
			components:{
				'category' : category,
				'productItem' : productItem
			},
			created:function(){
				this.pdlist = this.data[0].threeCategoryList
			},
			ready:function(){
				var screenHeight = document.documentElement.clientHeight
				this.winHeight = screenHeight+'px'
				document.body.style.height = screenHeight +'px'
				document.body.style.overflow = 'hidden'
				
				//this.$refs.category.$el.parentElement.parentElement.parentElement.parentElement.nextElementSibling.style.display="none"

				//将滚动事件派发到window上面
				this.$el.querySelector('.product-list').addEventListener('scroll', function(e){
					var event = document.createEvent('HTMLEvents');
	                event.initEvent('scroll')
	                event.eventType = 'message'
					window.dispatchEvent(event)
				},true)

				var style = document.createElement('style')
				style.innerHTML = '.tip-no-more{display: none;}'
				document.body.appendChild(style)
			},
			events:{
				clickOne:function(idx){
					var rootFont = document.documentElement.style.fontSize.split('px')[0]
					this.$el.querySelector('.product-list').scrollTop = 0
					this.$set('pdlist', this.data[idx].threeCategoryList)
					this.$el.querySelector('.category').scrollTop = rootFont * idx
				}
			}
		})
	)
</script>
<style lang="less">
	@import '../../../../../b/components/src/core/less/layout.less';
	@import '../../../../../b/components/src/core/less/utils.less';
	.classify-wrapper{
		.flexbox();
		.category{
		    width: 1.62rem;
		    height: 100%;
		    background: #f0f0f0;
		    overflow-y: auto;
		    -webkit-overflow-scrolling: touch;
		    bottom: 0;
		    z-index: 2;
		}
		.product-list{
			.flexitem(1);
			background: #fff;
			height: 100%;
		    overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			.list{
				.grid(3);
				padding-left: .2rem;
				padding-top: .2rem;
			}
		}
	}
</style>