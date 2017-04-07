<template>
	<ul class="type-list" v-if="list">
		<category-item :class="" v-for="item in list" :idx="$index" :content="item">
			<span>{{item.secondCategoryName}}</span>
		</category-item>
	</ul>
</template>
<script>
	import categoryItem from './category.item.vue'
	export default(
		Vue.extend({
			props: ['list'],
			events:{
				clickOne:function(idx){
					this.$broadcast('reset')
					return true
				}
			},
			components:{
				'category-item' : categoryItem
			},
			created:function(){
				if(this.list.length > 1){
					this.list.forEach(function(item,idx){
						if(idx == 0){
							item.isActive = true
						}else
							item.isActive = false
					})
				}
			}	
		})
	)
</script>