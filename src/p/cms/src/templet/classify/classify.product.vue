<template>
	<li v-if="pdList" v-for="item in pdList">			
		<product :data="item">
			<div class="content-body" slot="content">
				<span>{{item.threeCategoryName}}</span>
			</div>
		</product>
	</li>
</template>
<script>
	import comps from 'components'
	export default(
	Vue.extend({
			props:['pdList'],
			components:{
				'product' : comps.Product.Default
			},
			data:function(){
				return{

				}
			},
			created:function(){
			},
			compiled: function(){

			}
		})
	)
</script>
<style lang="less">
	@import '../../../../../b/components/src/core/less/layout.less';
	@import '../../../../../b/components/src/core/less/utils.less';
	@import '../../../../../b/components/src/core/less/var.less';
	.product-list{
		.list{
			li{
				padding-right: .2rem;
				padding-bottom: .2rem;
				text-align: center;
				.product{
					background-color: #f8f8f8;
					.container {
						&.content{
							margin: .12rem 0 .14rem 0;
							color: #666;
							font-size: @font-nm-sm;
						}						
						font-size: @font-nm-sm;
						&.img{
							margin: .1rem;
							img{
								//height: 100%;
							}
						}
					}
				}				
			}
		}
	}
</style>