<template>
	<div class="game-wrapper wheel" :style="styleFun">
		<div class="game-container">
			<div class="game-content">
				<div class='row'>
					<div class="block" v-for="idx in [0,1,2]">
						<square :store="store" :valid-idx="getValidIdx(idx)" :idx="idx"></square>
					</div>
				</div>
				<div class='row'>
					<div class="block" v-for="idx in [7,8,3]">
						<div @click="startLottery" @touchstart="touchstart"  @touchend="touchend" class="wheel-btn" v-if="idx == 8">
							<img v-show="!onBtn" src="./images/wheel_btn.png">
							<img v-show="onBtn" src="./images/wheel_btn_active.png">
						</div>
						<square :store="store" :valid-idx="getValidIdx(idx)" v-else :idx="idx"></square>
					</div>
				</div>
				<div class='row'>
					<div class="block" v-for="idx in [6,5,4]">
						<square :store="store" :valid-idx="getValidIdx(idx)" :idx="idx"></square>
					</div>
				</div>
			</div>
			<div class="game-info" v-if="!leftNum">
				{{otherStateMsg}}
			</div>
			<div class='game-info' v-if="!!leftNum">
				您还有<em>{{leftNum}}</em>次抽奖机会
			</div>
		</div>
	</div>
	<layer :data="store.result.data"></layer>
</template>
<script>
	// import Transformer from '../../utils/dataTransformer.js'
	import comps from 'components'
	import requestMixin from './gameRequest.mixin.vue'
	import square from './wheel.square.vue'
	import maskLayer from './mask.layer.vue'
	export default(
		Vue.extend({
			mixins:[requestMixin],
			components: {
				cimg: comps.Image,
				square: square,
				layer: maskLayer
			},
			data:function(){
				return {
					inited: false,
					canPaly: false,
					/**
					 * 数据共享store
					 * @type {store}
					 */
					store: {
						activityData: {},
						luckType: '',
						result: {},
						prizeIdx: null,
						param: {},
						//空值数组
						empties: [],
					},
					otherStateMsg: '',
					onBtn: false,
					hasLogin: false,
					waiting: false,
					leftNum: null,//抽奖次数
					/**
					 * 抽奖的计时器
					 * @type {Function}
					 */
					ticker: null,
					/**
					 * 跳帧频率，单位毫秒
					 * @type {Number}
					 */
					sequence: 100,
					/**
					 * 指针,0-8
					 * @type {Number}
					 */
					pointer: 0,
					/**
					 * 抽奖特效圈数
					 * @type {Number}
					 */
					circle: 2,
					/**
					 * 圈数计数
					 * @type {Number}
					 */
					circleCount: 0,
					/**
					 * 中奖的序号
					 * @type {Number}
					 */
					prizeIdx: null,
					/**
					 * 是否在游戏中
					 * @type {Boolean}
					 */
					isPlaying: false,
				}
			},
			created:function(){	
				this.init();
			},
			methods:{
				init: function(){
					//定义环境 接口
		            //this.data.gameId = 'd60be2ad'//'f8b99828'
		            //设置关于活动信息 的请求
		            var activetyInfo = {
                        url: this.getInfoReqUrl,
                        type: 'post',
                        isPostBody: 'Y',
                        data: {'promId': this.data.gameId}
                    };
	                //去请求 app版本 ，设备mac地址，userAgent
	                $g.Promise.all([$g.getVersion(),$g.getUniqueId(),$g.http(activetyInfo)])
	    			.then(function(data){
	    				var version = data[0];
	    				var uniqueId = data[1];	//dev默认为‘1234567890’ 
	    				//活动信息返回值
						//activityData
						/**
						* activityData参数说明
						* 参数           		类型    				说明                     		值
						* state    	  		string          	 接口状态             success/no_login...
						* ramark         		string          	 接口提示 
						* luckType				string				 
						* 
						* 
						* 抽奖类型             'order'(订单),'normal'(普通),'score'（美豆）
						* data           		object           	 奖池数据  
						* 	>.coupons			array（number）		 奖池 金额
						* 	>.remarks			array                奖项信息
						* 		>.remark     	string               （展示）
						* 		>.couponType 	string					(奖项类型)			0:红券；3：实物；4：虚拟券；10：美豆
						* 		>.couponVal   	string					奖项金额
						*/            			
	    				this.store.activityData = data[2]
	    				//渲染大转盘
						var param = {
							promId: this.data.gameId,
							//获取登陆指纹
							equipmentUfpd: $g.cookie.parse()['ufpd'],
	    					mac: uniqueId,
	    					ufpd: $g.cookie.parse()['ufpd'],
	    					version: version || '',
	    					uniqueId: uniqueId,
	    					is_req:  version > 64 ? '1' : '0',
	    					//必须的*** uA   **参数 注意书写
	    					uA: Base64.encode(navigator.userAgent.toLowerCase()),
	    					luckType: this.store.activityData.data.luckType
						}
						
						if($g.env.gomeplus || (version > 64 && $g.env.gome)){
							param.is_req = '1';//新版本
						}else{
							param.is_req = '0';//新版本
						}
						if($g.env.app){
							//app需要覆盖wap的部分
							
							param.source = 'app',
							param.app_type = $g.system.android ? 'android_app' : 'ios_app'
							param.mac = param.app_type + version + uniqueId
							param.platform = $g.system.android ? '2' : '1'
							param.equipmentUfpd = $g.cookie.parse()['GDF']
	    					param.ufpd = $g.cookie.parse()['GDF']
						}
						this.store.param = param
		                //请求活动信息接口
	    				this.getTimesLeft(true)
	    			}.bind(this))
	    		},
	    		//获取抽奖次数
				getTimesLeft:function(dontToast){
					return $g.http({
						url: this.getTimesReqUrl,
                        type: 'post',
                        isPostBody: 'Y',
                        isNeedLoading: 'N',
                        data: this.store.param
					}).then(function(data){
						if(data.state == 'success'){
							// this.leftNum = data.data || data.leftNum
							this.leftNum = data.leftNum == undefined ? data.data : data.leftNum
							this.leftNum = typeof this.leftNum == 'string' ? this.leftNum :String(this.leftNum)
						}else{
							if(data.state == 'no_login'){
								this.otherStateMsg = '请先登录，再抽奖！'
							}else{
								if(dontToast){
									this.otherStateMsg = data.remark
								}else{
									$g.toast(data.remark)
								}
							}
						}
						setTimeout(function(){
							this.inited = true;
						}.bind(this), 2000)
						/**
						 * getLuckNum.do   Data参数说明
						 * 参数           		类型    				说明                     		值
						 * state    	  		string          	 接口状态             success/no_login...
						 * ramark         		string          	 接口提示 
						 * data(美豆)/leftNum	Number				 用户参与次数             'order'(订单),'normal'(普通),'score'（美豆）
						 */ 
						/*if(data.state == 'success'){
							this.hasLogin = true//设置为已登录状态
							if(data.leftNum){
								this.$set('leftNum',data.leftNum)	//注入抽奖次数
							}else if(data.data){
								this.$set('leftNum',data.data.tips)
								//美豆的 用户参与次数是data.data.tips 字段
							}
							if(this.leftNum == '0'){
								this.prizeState.isNoChance = true
							}
						}else if(data.state == 'no_login'){
							this.hasLogin = false
							this.otherStateMsg = '请先登录，再抽奖！'
						}else{
							this.otherState = true//其他状态
							this.$set('otherStateMsg',data.remark)	//改变提示语
						}*/
						return data;
					}.bind(this))
				},
				/**
				 * 点击抽奖的特效啊特效
				 * @return null
				 */
				touchend: function(){
					this.onBtn = false;
				},
				/**
				 * 点击抽奖的特效啊特效
				 * @return null
				 */
				touchstart: function(){
					this.onBtn = true;
				},
				startLotteryFX: function(){
					this.$nextTick(function(){
						this.isPlaying = true
					})
					//this.pointer = 0
					this.ticker = setInterval(this.tickerFn, this.sequence)
					if(this.store.prizeIdx === null){
						this.store.prizeIdx = this.store.empties[Math.floor(Math.random()*this.store.empties.length)]
					}
				},
				startLottery: function(){
					if(this.isPlaying){
						$g.toast('正在游戏中')
					}
					if(!this.inited){
						$g.emitDOM('loading')
						var interval = setInterval(function(){
							if(this.inited){
								$g.emitDOM('loaded')
								clearInterval(interval)
								this.defferedLottery();
							}
						}.bind(this), 100)
					}else{
						this.defferedLottery();
					}
				},
				defferedLottery: function(){
					if(!this.ticker && !this.isPlaying){
						this.store.prizeIdx = null;
						this.isPlaying = true
						$g.http({
							url: this.lotteryReqUrl,
	                        type: 'post',
	                        isPostBody: 'Y', 
	                        data: this.store.param
						}).then(function(data){
							// if(data.state == 'no_login'){
							// 	$g.login()
							// 	return data
							// }else if(data.state != 'success'){
							// 	return data
							// }else{
							// 	this.store.result = data
							// 	return this.getTimesLeft();
							// }
							this.store.result = data
							if(data.state == 'success'){
								return this.getTimesLeft();
							}else{
								return data
							}
						}.bind(this))
						.then(function(data){
							if(!data || data.state != 'success'){
								if(data.remark)
									$g.toast(data.remark)
								this.isPlaying = false
								// return
							}
							/**
							 * goodLuck.do data参数说明
							 * 参数           		类型    				说明                     		值
							 * state    	  		string          	 接口状态             success/no_login...
							 * ramark         		string          	 接口提示 
							 * promId				string				 游戏id             'order'(订单),'normal'(普通),'score'（美豆）
							 * data           		object           	 奖池数据  
							 * 	 >.remark     		string               奖项信息（展示）
							 * 	 >.couponType 		string				 (奖项类型)			0:红券；3：实物；4：虚拟券；10：美豆
							 * 	 >.couponValue   	string				 奖项金额
							 * 	 >.tips				string				 弹层提示信息
							 */				
							// if(this.store.result.state && this.store.result.state == 'success' && data.state == 'success'){
							// 	if(this.leftNum){
							// 		this.startLotteryFX();
							// 	}else{
							// 		this.isPlaying = false
							// 		this.otherStateMsg = data.remark
							// 	}
							// 	// 中奖了
							// }else{
							// 	this.isPlaying = false
							// 	if(this.store.result.state == 'no_login'){
							// 		$g.login();//去登陆
							// 	}else{
							// 		// 弹出错误提示信息
							// 		if(data.state != 'success')
							// 			$g.toast(data.remark)
							// 		else
							// 			$g.toast(this.store.result.remark)
							// 	}
							// }
							// 
							// LXC 20121201
							if(this.store.result.state == 'no_login'){
								$g.toast(this.store.result.remark)
								setTimeout(function(){
									$g.login();//去登陆
								}, 300)	
								return
							}else if(this.store.result.state == 'success'){
								
								if(data.state == 'no_login'){
									$g.toast(data.remark)
									setTimeout(function(){
										$g.login();//去登陆
									}, 300)	
								}else{
									this.startLotteryFX();
									if(data.state !== 'success'){
										if(this.store.result.leftNum)
											this.leftNum = this.store.result.leftNum
										this.otherStateMsg = data.remark
										$g.toast(data.remark)
									}
								}
							}else{
								this.isPlaying = false
								this.otherStateMsg = this.store.result.remark
								$g.toast(this.store.result.remark)
								if(this.store.result.state == 'user_no_count_all'
									|| this.store.result.state == 'user_no_count_today'
									|| this.store.result.state =='user_no_count'
									|| this.store.result.state == 'order_no_count'
									|| this.store.result.state == 'invalid_playTime'){
									this.leftNum = '0'
									this.otherStateMsg = data.remark
									$g.toast(this.store.result.remark)
								}
							}
						}.bind(this))
						.catch(function(e){
							$g.toast('抽奖失败')
							this.isPlaying = false
							clearInterval(this.ticker)
							this.circleCount = 0
							this.isPlaying = false
							this.ticker = null
						})
					}

				},
				tickerFn: function(){
					this.$broadcast('active', this.pointer)
					this.countTime += this.sequence
					if(this.circleCount >= this.circle && this.store.prizeIdx == this.pointer){
						clearInterval(this.ticker)
						this.circleCount = 0
						this.isPlaying = false
						this.ticker = null
						setTimeout(function(){
							this.$broadcast('isLayerShow',true)
						}.bind(this),700)
						// 弹出提示
						return
					}
					if(this.pointer < 7){
						this.pointer++
					}else{
						this.circleCount++
						this.pointer = 0
					}
				},
				getValidIdx: function(idx){
					idx = Number(idx)
					if(idx == 0){
						return -1
					}else if(idx == 5){
						return -1
					}else if(idx > 0 && idx < 5){
						return idx - 1
					}else if(idx > 5 && idx != 8){
						return idx -2
					}
					return idx
				},
				
			}
		})
	)
</script>
<style lang='less'>
	@import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    @import './game.less';
    .wheel {
    	&.game-wrapper {
    		width: 100%;
    		padding: .2rem;
    		background-position: center center;
		    background-repeat: no-repeat;
		    background-size: 100% 100%;
    		.game-container {
    			background-image: url(./images/wheel_square_bg.png);
    			background-repeat: no-repeat;
    			-webkit-background-size: 100% auto;
    			background-size: 100% auto;
    			padding: 5% 5% 4% 5%;
    			.game-content {
    				background-color: @content-bg;
    				.row {
    					.flexbox();
    					.block {
							.wheel-btn {
								margin: -1 * @block-padding;
							}
    						.img-container {
    							border-radius: .2rem;
    							margin: .2rem;
    						}
	    					.flexitem(1);
    					}
    				}
    			}
    			.game-info {
    				text-align: center;
    				font-size: @font-nm;
    				font-weight: bold;
					margin-top: 7.5%;
					color: @game-font-color-dark;
					em {
						font-weight: bold;
						font-size: @font-lg;
						color: @game-font-color-em;
					}
				}
    		}
    	}
    }
</style>