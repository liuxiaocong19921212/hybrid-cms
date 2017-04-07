<script>
	import Transformer from '../../utils/dataTransformer.js'
	export default({
		computed: {
			styleFun:function(){
				var styleStr = ''
				if(this.data.backgroundImg){
					styleStr = 'background-image:url('+ this.data.backgroundImg +')';
				}else if(this.data.backgroundColor){
					styleStr = 'background-color:'+ this.data.backgroundColor;
				}else{
					styleStr = ''
				}
				return styleStr
			},
			getInfoReqUrl: function(){
				return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/order/getActivityInfo.do')
			},
			lotteryReqUrl: function(){
				switch (this.store.activityData.data.luckType){
					//普通
					case 'normal':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/normal/goodLuck.do')
						break;
					//实物订单
					case 'order':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/order/orderLuck.do')
						break;
					//美豆
					case 'score':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/integra/integralLuck.do')
						break;
				}
			},
			getTimesReqUrl: function(){
				switch (this.store.activityData.data.luckType){
					//普通
					case 'normal':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/normal/getUserGoodLuckNum.do')
						break;
					//实物订单
					case 'order':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/order/getUserOrderLuckNum.do')
						break;
					//美豆
					case 'score':
						return Transformer.transEnv('http://hd.gome.com.cn/promotion/luck/wap/integra/getLuckNum.do')
						break;
				}
			}
		},
	})
		
</script>