<template>
	<ul  v-if="data && data.shortcutList.length >=4" class="nav-shortcut " v-bind:class="[isActivity,grid]" :style="bg">
		 <li v-for="(index,item) in data.shortcutList" v-if="index<8">
            <a :href="hrefLinks[index]">
            	<div class="nav-icon">
        			<img :src="item.menuImg">
            		<span class="marker" v-if="item.promoList[0] && item.promoList[0].menuPromo" :style="{color:item.promoList[0].markColor,borderColor:item.promoList[0].markColor}">{{item.promoList[0].menuPromo}}</span>
            	</div>
                <p class="title" :style="{color:item.fontColor}">{{item.menuName}}</p>
            </a>
        </li>
	</ul>
</template>
<script>
	import Transformer from '../../utils/dataTransformer.js'

	export default(
		Vue.extend({
			data:function(){
				return{
					options:{
					},
					grid: 'grid4',
					bg: '',
					isActivity:'',
					hrefLinks:[]
				}
			},
			created: function(){
				var num = this.data.shortcutList.length > 8 ? 8 : this.data.shortcutList.length;
				if(num%2 == 0 && num>5 && num <= 8){
					this.grid = 'grid' + num/2;
				}else if(num<=5){
					this.grid = 'grid' + num;
				}else if(num%2 != 0 && num>5 && num<8){
					this.grid = 'grid' + (num-1)/2;
					this.data.shortcutList = this.data.shortcutList.slice(0,num-1);
				}else{
					this.grid = 'grid5';
					this.data.shortcutList = this.data.shortcutList.slice(0,8);
				}

				if(this.data.backgroundImg){
					this.bg = 'background-image:url('+this.data.backgroundImg+')'
					this.isActivity = 'activity'
				}
				for(var i in this.data.shortcutList){
					this.manageUrl(i);
				}

			},
			methods:{
				manageUrl:function(index){
					var link;
					if(this.data.shortcutList[index].plugId != undefined){
						this.link = Transformer.transHref(this.data.shortcutList[index]);
					}else if(this.data.shortcutList[index].plugId == undefined && this.data.shortcutList[index].menuCode){
						switch(this.data.shortcutList[index].menuCode){
							//问题汇总：
							//	‘机票’ + ‘更多服务’ ————-- app端没有做，需要产品提需求
							//	'及信通‘+’瑶瑶美‘-----app端服务已停  协商为致空
							//	‘订单跟踪’--------暂时指向 '我的订单' 需跟产品确认
							//	以上，都是跟app端沟通过的结果
							case '5':
								//手机充值
								this.link = Transformer.transEnv('http://m.gome.com.cn/recharge.html');
								break;
							case '11':
								//游戏
								this.link = Transformer.transEnv('http://m.gome.com.cn/film.html');
								break;
							case '8':
								//电影票
								this.link = Transformer.transEnv('http://m.gome.com.cn/film.html');
								break;
							case '10':
								//连接地址
								this.link = this.data.shortcutList[index].menuLink;
								break;
							case '13':
								//美英宝
								this.link = Transformer.transEnv('http://m.gome.com.cn/meiyingbao.html');
								break;
							case '14':
								//瑶瑶美----------为空
								this.link = '';
								break;
							case '15':
								//订单
								this.link = Transformer.transEnv('http://m.gome.com.cn/my_order.html');
								break;
							case '16':
								//收藏
								this.link = Transformer.transEnv('http://m.gome.com.cn/my_collect.html');
								break;
							case '17':
								//浏览历史-我的足迹
								this.link = Transformer.transEnv('http://m.gome.com.cn/visit_history.html');
								break;
							case '18':
								//订单跟踪---暂时指向 我的订单页面
							this.link = Transformer.transEnv('http://m.gome.com.cn/my_order.html');
								break;
							case '19':
								//机票--和’更多服务‘---------------app端 说没有做，需要产品提需求
								this.link = '';
								break;
							case '20':
								//极信通----------为空
								this.link = '';
								break;
							case '21':
								//国美众筹
								this.link = Transformer.transEnv('http://m.gome.com.cn/finance-crowdfund.html');
								break;
							case '30':
								//积分兑换
								this.link = Transformer.transEnv('http://m.gome.com.cn/my_pointschange.html');
								break;
							case '31':
								//领取优惠券-->领券中心
								this.link = Transformer.transEnv('http://m.gome.com.cn/coupons_center.html');
								break;
							case '33':
								//新版国美金融
								this.link = Transformer.transEnv('http://m.gome.com.cn/finance-index.html');
								break;
							case '34':
								//票据理财
								this.link = Transformer.transEnv('http://m.gome.com.cn/licai_bill_list-010-000.html');
								break;
							case '35':
								//p2p
								this.link = Transformer.transEnv('http://m.gome.com.cn/licai_p2p_list-020-000.html');
								break;
							case '36':
								//固收
								this.link = Transformer.transEnv('http://m.gome.com.cn/licai_gs_list-040-000.html');
								break;
							case '37':
								//白拿
								this.link = Transformer.transEnv('http://m.gome.com.cn/finance-baina.html');
								break;
							case '38':
								//我的金融
								this.link = Transformer.transEnv('http://m.gome.com.cn/finance-mycenter.html');
								break;
							case '39':
								//我的国美
								this.link = Transformer.transEnv('http://m.gome.com.cn/my_gome.html');
								break;
							case '40':
								//预约理财 --->我的预约
								this.link = Transformer.transEnv('http://m.gome.com.cn/my_subscribe.html');
								break;
							case '999':
								//更多服务
								this.link = '';
								break;
							default:
								this.link = Transformer.transHref(this.data.shortcutList[index]);;
								break;
						}
					}else{
						this.link = Transformer.transHref(this.data.shortcutList[index]);;
					}
					//herflinks
					this.hrefLinks.push(this.link);
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
	.nav-shortcut{
		padding: .2rem 0 0;
		overflow: hidden;
		background-color:@white;
		li{
			text-align: center;
			margin-bottom: .2rem;
			a{
				display: block;
				width: 100%;
			}
			.title{
				font-size: @font-nm-sm;
				color: @gray-dark;
				.ellipsis();
			}
		}
		.nav-icon{
			margin: 0 auto .1rem;
			text-align: center;
			position: relative;
			min-height: .84rem;
			height: 100%;
			.flexbox();
			.flexbox.center();
			img{
				max-width: 1.3rem;
				width: auto;
				height: .83rem;
			}
			.marker{
				position: absolute;
				top: -.08rem;
				left: 40%;
				z-index: 2;
				font-size: 0.18rem;
				vertical-align: middle;
				background: #fff;
				border-radius: 0.1rem;
				padding: 0.03rem .08rem;
				text-align: center;
				max-width: 50%;
				overflow: hidden;
				border: 1px solid #000;
				height: 0.22rem;
				line-height: 0.25rem;
				white-space: normal;
				box-sizing: content-box;
			}

		}
		&.activity{
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			.title{
				color: @white;
			}
		}
		&.grid2{
			font-size: 0;
			>*{
				width: 50%;
				box-sizing: border-box;
				display: block;
				float: left;
			}
		}
		&.grid3{
			font-size: 0;
			>*{
				width: 33.33333333%;
				box-sizing: border-box;
				display: block;
				float: left;
			}
		}
		&.grid4{
			font-size: 0;
			>*{
				width: 25%;
				box-sizing: border-box;
				display: block;
				float: left;
			}
		}
		&.grid5{
			font-size: 0;
			>*{
				width: 20%;
				box-sizing: border-box;
				display: block;
				float: left;
			}
		}
		&.grid6{
			font-size: 0;
			>*{
				width: 16.6666%;
				box-sizing: border-box;
				display: block;
				float: left;
			}
		}
	}
</style>
