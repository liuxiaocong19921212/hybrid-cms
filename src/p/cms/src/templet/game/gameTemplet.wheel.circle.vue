<template>
	<div class="game-wrapper" v-if="isModShow">
		<!-- 刮奖前 显示 -->
		<div class="before" v-show="!prizeState.isPrized">
			<h3 class="title">刮***********大奖~</h3>
			<div class="btm-msg">
				<!-- 未登录 -->
				<p class="text" v-show="!isLogin && !otherState">请先登录，登陆后才能刮奖</p>
				<!-- 登陆 -->
				<p class="text" v-show="isLogin && !prizeState.isNoChance">您当前剩余<em>{{leftNum}}</em>次刮奖机会</p>
				<p class="text" v-show="isLogin && prizeState.isNoChance">亲，您暂无刮奖机会</p>
				<p class="text" v-else>{{otherStateMsg}}</p>
				<div class="" style="position:relative;width: 2.82rem;display: block;margin: auto;">
					<a class="prize-btn" href="javascript:;" @click="preizeClick"><img src="images/gua_btn1.png"></a>
					<div class="tiger">
						<img src="images/tiger1.png">
					</div>
				</div>				
			</div>
		</div>
		<!-- 显示刮奖 -->
		<div class="guaing" v-show="prizeState.isScratchAreaShow">
			刮奖区
			<canvas id="scratchCanvas"></canvas>
		</div>
		<!-- 中奖 or 不中奖-->
		<div class="after" :class="{no_chance:prizeState.isNoChance}" v-show="prizeState.isPrized">
			<div class="" v-show="leftNum !== '0'">
				<h3 class="title">恭喜！您刮中了{{preizedData.data.remark}}</h3>
				<div class="btm-msg">
					<p class="text">您当前剩余<em>{{leftNum}}</em>次刮奖机会</p>
					<a class="prize-btn" href="javascript:;" @click="preizeClick"><img src="images/gua2_btn1.png"></a>
				</div>
			</div>
			<div v-else>
				<h3 class="title">恭喜！您刮中了{{preizedData.data.remark}}</h3>
				<p class="no-chance-tip">亲，您的刮奖机会已用完啦！</p>
			</div>
		</div>
	</div>
</template>
<script>
	import Transformer from '../../utils/dataTransformer.js'
	import comps from 'components'
	export default(
		Vue.extend({
			data:function(){
				return {
					isModShow : false,
					isStateShow:false,
					isLogin:false,
					otherState:false, //其他状态(出登陆外)
					otherStateMsg:'',
					prizeState:{						
						isScratchAreaShow:true,
						isPrized:false,
						isNoChance:false
					},
					leftNum:'',//抽奖次数
					preizedData:{},//中奖信息
					luckType:'',//抽奖类型 order（订单），normal(普通) 
					activityData : {},
					hdUrl:{},
					param:{}
				}
			},
			ready:function(){
				this.drawCanvas();
			},
			created:function(){	
				//判断模板是否过期
				var startDate = this.data.startDate,
					endDate = this.data.endDate;
				var startTime = new Date(startDate.replace(new RegExp('-','gm'),'/')).getTime(),
                	endTime = new Date(endDate.replace(new RegExp('-','gm'),'/')).getTime();
            	var nowTime = new Date().getTime();//当前时间 秒
	            if(startTime <= nowTime && nowTime <= endTime){
	                this.isModShow = true	               
	            }else{
	            	this.isModShow = false
	            }

	            console.log($g)
	            //定义环境 接口

	            //请求活动信息接口
	            var _self = this
	            this.param.promId = _self.data.gameId	//设置请求的gameID
	            this.param.uA = Base64.encode(navigator.userAgent.toLowerCase());//必须的*** uA   **参数 注意书写
	            //设置关于活动信息 的请求
	            var activiActivetyUrl = Transformer.transEnv('http://hd.gome.com.cn/')+'promotion/luck/wap/order/getActivityInfo.do'
	            var activetyInfo = {
                        url: activiActivetyUrl,
                        type: 'post',
                        isPostBody: 'false', 
                        data: {'promId':_self.data.gameId}
                    };
                //去请求 app版本 ，设备mac地址，userAgent
                Promise.all([$g.getVersion(),$g.getUniqueId(),$g.http(activetyInfo)])
            			.then(function(data){
            				var version = data[0];
            				var uniqueId = data[1];	//dev默认为‘1234567890’ 
            				
            				var is_req = ''
							if($g.env.gomeplus || (version > 64 && $g.env.gome)){
								is_req = '1';//新版本
            				}else{
            					is_req = '0';//新版本
            				}
            				version = version == undefined || '0' ? '' : version//设置版本号            				
            				uniqueId = uniqueId == undefined ? '' : uniqueId
            				this.param.version = version
            				this.param.is_req = is_req
            				

            				// 去调用获取cookie信息的参数
            				this.setAjaxParam(uniqueId,version);

            				//活动信息返回值
            				//activityData
							/**
							 * activityData参数说明
							 * 参数           		类型    				说明                     		值
							 * state    	  		string          	 接口状态             success/no_login...
							 * ramark         		string          	 接口提示 
							 * luckType				string				 抽奖类型             'order'(订单),'normal'(普通),'score'（美豆）
							 * data           		object           	 奖池数据  
							 * 	>.coupons			array（number）		 奖池 金额
							 * 	>.remarks			array                奖项信息
							 * 		>.remark     	string               （展示）
							 * 		>.couponType 	string					(奖项类型)			0:红券；3：实物；4：虚拟券；10：美豆
							 * 		>.couponVal   	string					奖项金额
							 */            			
            				var activityData = typeof data[2] == 'string' ? JSON.parse(data[2]) : data[2];
            				this.luckType = data[2].data.luckType;//设置类型
            				return this.param
            			}.bind(this))
            			.then(function(param){
            				this.getLotteryType(param)
            			}.bind(this))


            	this.getCookie();
			},
			methods:{
				//获取抽奖次数
				getLotteryType:function(param){
					var _self = this
					// this.luckType = score  为美豆 请求用户信息地址‘http://hd.gomeprelive.com.cn/promotion/luck/wap/integra/getLuckNum.do’
					// 				 请求抽奖接口为 ‘http://hd.gome.com.cn/promotion/luck/wap/integra/integralLuck.do’ *******///////********
					var orderType = this.luckType == 'score' ? 'integra' : this.luckType 
					var userTimesUrl = Transformer.transEnv('http://hd.gome.com.cn/')+'promotion/luck/wap/' + orderType + '/getUserOrderLuckNum.do'
					$g.http({
						url: userTimesUrl,
                        type: 'post',
                        isPostBody: 'Y', 
                        data: param
					}).then(this.renderStart)
				},
				//获取cookie的方式
				getCookie:function(name){
					var cookipMap = $g.cookie.parse()
					console.log('ssss',cookipMap)
					var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	                if(arr=document.cookie.match(reg))
	                    return unescape(arr[2]);
	                else
	                    return null;
				},
				setAjaxParam:function(uniqueId,version){
					var equipmentUfpd = '',
						app_type = '',
						platform = '',
						source = ''
					if($g.env.app){
						source = 'app'
						equipmentUfpd = this.getCookie('GDF')	//获取登陆指纹 app 为获取GDF
						if($g.system.android){
							app_type = 'android_app'			//其实我也不懂 为啥要这么多参数  还都是写死的文本 
                        	platform = '2'
						}else{
							app_type = 'ios_app'
                        	platform = '1'
						}
					}else{
						equipmentUfpd = this.getCookie('ufpd')	//获取登陆指纹
					}
					// _self.param.mac = app_type + version + uniqueId//奇葩的设备号
					this.param.mac = app_type + version + uniqueId
					this.param.ufpd = equipmentUfpd;
					this.param.app_type = app_type;
					this.param.platform = platform;
					this.param.source = source;
					console.log(this.param)
					return this.param
				},
				renderStart:function(data){
/**
 * getLuckNum.do   Data参数说明
 * 参数           		类型    				说明                     		值
 * state    	  		string          	 接口状态             success/no_login...
 * ramark         		string          	 接口提示 
 * data(美豆)/leftNum	Number				 用户参与次数             'order'(订单),'normal'(普通),'score'（美豆）
 */  					
					if(data.state == 'success'){
						this.isLogin = true//设置为已登录状态
						if(data.leftNum){
							this.$set('leftNum',data.leftNum)	//注入抽奖次数
						}else if(data.data){
							this.$set('leftNum',data.data)
							//美豆的 用户参与次数是data.data 字段
						}
						if(this.leftNum == '0'){
							this.prizeState.isNoChance = true
						}
					}else if(data.state == 'no_login'){
						this.isLogin = false
					}else{
						this.otherState = true//其他状态
						this.$set('otherStateMsg',data.remark)	//改变提示语
					}
				},
				preizeClick:function(){
					// this.drawCanvas();
					this.prizeState.isScratchAreaShow = true				//测试**********************
					if(this.prizeState.isNoChance)return
					var _self = this
					var orderType = this.luckType == 'score' ? 'integra' : this.luckType 
					var lotteryDrawUrl = Transformer.transEnv('http://hd.gome.com.cn/') + 'promotion/luck/wap/' + orderType + '/' + orderType + 'Luck.do'
					$g.http({
						url: lotteryDrawUrl,
                        type: 'post',
                        isPostBody: 'Y', 
                        data: _self.param
					}).then(function(data){
						console.log('中奖信息',data)
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
						if(data.state && data.state == 'success'){	
							// this.setShowState();
							// 将其他状态设为false  隐藏其他模块
							this.prizeState.isScratchAreaShow = false
							this.prizeState.isPrized = false
							this.prizeState.isNoChance = false
							this.prizeState.isPrized = true

							//抽奖次数为0 改变 nochace z状态
							if(data.leftNum == '0'){
								this.prizeState.isNoChance = true
							}
							// 中奖了
							this.$set('leftNum',data.leftNum)	//注入抽奖次数
							this.$set('preizedData',data)		
						}else{
							if(data.state == 'no_login'){
								$g.login();//去登陆
							}else{
								// 弹出错误提示信息
								$g.toast(data.remark)
							}
						}
					}.bind(this))
					.catch(function(e){
						console.log(e)
					})
				},
				drawCanvas:function(){
					var canvas = document.getElementById('scratchCanvas'),
						cnx = canvas.getContext('2d');

					var img = new Image();
					img.src = 'images/guaing.png';
					img.onload=function(){
						cnx.drawImage(img, 0, 0,200, 200);
						cnx.globalCompositeOperation = 'destination-out';
						var event_bool = false;
						function eventDown(e){
							e.preventDefault();
							event_bool = true
						}
						function eventUp(e){
							e.preventDefault;
							event_bool = false
						}
						function eventMove(e){
							e.preventDefault();
      						if(event_bool){
      							var x=e.pageX-offset_left;
          						var y=e.pageY-offset_top;
          						cnx.beginPath();
						        cnx.arc(x, y, 15, 0, Math.PI * 2);
						        cnx.closePath();
						        cnx.fill();
      						}
						}
						canvas.width = 200;
						canvas.height = 200;

						canvas.addEventListener('touchstart', eventDown)
						canvas.addEventListener('touchsend', eventUp)
						canvas.addEventListener('touchmove', eventMove)
						canvas.addEventListener('mouseDown', eventDown)
						canvas.addEventListener('mouseUp', eventUp)
						canvas.addEventListener('mouseMove', eventMove)
					}
				}
			}
		})
	)
</script>
<style lang="less">
	@import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    @scratchCardHeight : 2.36rem;
    .game-wrapper{
    	margin: .3rem;
		padding: .14rem .2rem;
		background: #fff;
		font-family: Arial;
		.before,.after{
			background: url(images/bg1.png) repeat-x left center;
		    background-size: auto 100%;
		    padding-bottom: .2rem;
		    padding-top: .16rem;
		    height:  @scratchCardHeight;
		    box-sizing: border-box;
		    .title{
		    	font-size: 0.3rem;
				color: #Fff;
				width: 80%;
				text-align: center;
				margin: auto;
				line-height: 1.5;
				margin-bottom: 0.3rem;
		    }
		}
		.before{
			.btm-msg{
				.text{
					em{
						color: #ffdd3e;
					}
				}
			}
		}
		.after{
			background-image: none;
			background-color: #ffe9e9;
			border:1px solid #f3dddd;
			&.no_chance .title{
				margin-top: 0.54rem;
				margin-bottom: 0.32rem;
			}
			.title{
				color: #ef3030;
			}
			.text{
				color: #999;
			}
		}
		.guaing{
			height:  @scratchCardHeight;
    		box-sizing: border-box;
		}
		.btm-msg{			
			margin: auto;
			position: relative;
			.prize-btn{
				width: 2.82rem;
				display: block;
				margin: auto;
			}
			.text{
				color: #ccc;
				font-size: 0.22rem;
				margin-bottom: .14rem;
				text-align: center;
				em{
					color: #ef3030;
					margin: 0 .06rem;
				}
			}
		}
		.tiger{
			position: absolute;
			left: -1.08rem;
			bottom: 0;
			width: 1.08rem;
		}
		.no-chance-tip{
			color: #999;
			font-size: 0.22rem;
			text-align: center;
			margin-bottom: 0.6rem;
		}
    }
</style>