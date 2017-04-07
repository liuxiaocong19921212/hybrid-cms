<template>
	<div class="game-wrapper scrape" v-if="isModShow" :style="styleFun">
		<div class="scrape_con">
			<!-- 刮奖前 显示 -->
			<div class="before" v-show="!prizeState.isPrized">
				<h3 class="title box center">{{data.displayName}}</h3>
				<div class="btm-msg" :data-left='leftNum'>
					<p class="text" v-if="!leftNum" >{{otherStateMsg}}</p>
					<p class="text" v-if="!!leftNum">您当前剩余<em>{{leftNum}}</em>次刮奖机会</p>
					<div class="prize-btn-box">
						<a class="prize-btn" href="javascript:;" @click="preizeClick"><img src="images/gua_btn1.png"></a>
						<div class="tiger">
							<img src="images/tiger1.png">
						</div>
					</div>				
				</div>
			</div>
			<!-- 显示刮奖 -->
			<div class="guaing" v-show="prizeState.isScratchAreaShow">
				<canvas id="scratchCanvas" class="scratch-canvas" @touchmove="touchmove" @touchstart="touchstart" @touchstart="touchstart" :width="canvas_width" :height="canvas_height"></canvas>
			</div>
			<!-- 中奖 or 不中奖-->
			<div class="after" :class="{no_chance:prizeState.isNoChance}" v-show="prizeState.isPrized">
				<h3 class="title box center">{{store.result.data.tips}}</h3>
				<div class="btm-msg">
					<p class="text" v-if="!!leftNum">您当前剩余<em>{{leftNum}}</em>次刮奖机会</p>
					<p class="text" v-if="!leftNum">{{otherStateMsg}}</p>
					<a class="prize-btn" href="javascript:;" @click="preizeClick" v-if="!prizeState.isNoChance"><img src="images/gua2_btn1.png"></a>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Transformer from '../../utils/dataTransformer.js'
	import comps from 'components'
	import requestMixin from './gameRequest.mixin.vue'
	export default(
		Vue.extend({
			mixins:[requestMixin],
			data:function(){
				return {
					isModShow : false,
					isLogin:false,
					otherStateMsg:'',
					prizeState:{						
						isScratchAreaShow:true,
						isPrized:false,
						isNoChance:false
					},
					/**
					 * 验证码的值
					 * @type {String}
					 */
					captchaCode:'',
					/**
					 * 是否需要验证码
					 * @type {Boolean}
					 */
					isCaptchaCode: true,
					/**
					 * 验证码地址
					 * @type {String}
					 */
					captchCodeUrl: '',
					leftNum:'',//抽奖次数
					/**
					 * 数据共享store
					 * @type {store}
					 */
					store: {
						activityData: {},
						luckType: '',
						result: {},//中奖信息
						prizeIdx: null,
						param: {},
						//空值数组
						empties: [],
					},
					param:{},
					/**
					 * 刮刮状态
					 * @type {Boolean}
					 */
					isClicked:false,
					event_bool:false,
					canvas_width:0,
					canvas_height:0
				}
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
	            this.init();//初始化

			},
			methods:{
				//初始化函数
				init:function(){
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
	    				var uniqueId = data[1];	

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
				getTimesLeft:function(){
					$g.http({
						url: this.getTimesReqUrl,
                        type: 'post',
                        isPostBody: 'Y', 
                        data: this.store.param
					}).then(this.renderStart)
				},
				//获取cookie的方式
				getCookie:function(name){
					var cookipMap = $g.cookie.parse()
					var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	                if(arr=document.cookie.match(reg))
	                    return unescape(arr[2]);
	                else
	                    return null;
				},
				renderStart:function(data){
					//todo 我觉得从这里设置宽高不合适 但是 canvas 只能设行内
					this.canvas_width = document.getElementById('scratchCanvas').parentElement.offsetWidth	
					this.canvas_height = document.getElementById('scratchCanvas').parentElement.offsetHeight

					if(data.state == 'success'){
						this.leftNum = data.leftNum == undefined ? data.data : data.leftNum
						this.leftNum = typeof this.leftNum == 'string' ? this.leftNum :String(this.leftNum)
						if(this.leftNum == '0'){
							this.prizeState.isNoChance = true
						}else{
							this.prizeState.isNoChance = false
						}
					}else if(data.state == 'no_login'){
						this.otherStateMsg = '请先登录，再抽奖！'
					}else{
						this.otherStateMsg = data.remark
					}
				},
				preizeClick:function(){	
					//是否需要验证码
					// this.captchCodeUrl = $g.host.m + '/capacha/getCapacha?time=' + Math.random()*35;
					// if(this.isCaptchaCode){		
					// 	this.$broadcast('isCaptchaCode',true)
					// }else{	
						this.prizeSendRequest();
					// }
					
				},
				prizeSendRequest:function(){
					if(this.isClicked)return
					$g.http({
						url: this.lotteryReqUrl,
                        type: 'post',
                        isPostBody: 'Y', 
                        data: this.store.param
					}).then(function(data){
							this.store.result = data
							if(data.state == 'success'){
								return this.getTimesLeft();
							}else{
								return data
							}
							
						// }
					}.bind(this))
					.then(function(data){
						// data:返回用户次数
						// this.store.result :抽奖数据
						this.isClicked = false
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
								this.prizeState.isScratchAreaShow = true
								this.prizeState.isPrized = true
								this.drawCanvas();//弹出刮奖效果
								if(data.state !== 'success'){
									if(this.store.result.leftNum)
										this.leftNum = this.store.result.leftNum
									this.otherStateMsg = data.remark
									$g.toast(data.remark)
								}
							}
						}else{
							this.prizeState.isScratchAreaShow = false
							this.prizeState.isPrized = false
							this.otherStateMsg = this.store.result.remark
							$g.toast(this.store.result.remark)
							if(this.store.result.state == 'user_no_count_all'
								|| this.store.result.state == 'user_no_count_today'
								|| this.store.result.state =='user_no_count'
								|| this.store.result.state == 'order_no_count'
								|| this.store.result.state == 'invalid_playTime'){
								this.prizeState.isNoChance = true
								this.leftNum = '0'
								this.otherStateMsg = data.remark
								$g.toast(this.store.result.remark)
							}
						}
					}.bind(this))
					.catch(function(e){
							$g.toast('抽奖失败')
							tthis.prizeState.isScratchAreaShow = false
							this.prizeState.isPrized = false
						})
				},
				drawCanvas:function(e){
					document.querySelector('.after').style.zIndex = 0
					if(!this.prizeState.isScratchAreaShow)return
					var _self = this
					var canvas = document.getElementById('scratchCanvas'),
						cnx = canvas.getContext('2d'),
						canvas_w = canvas.parentElement.offsetWidth,
						canvas_h = canvas.parentElement.offsetHeight;
					var offset_left = canvas.parentElement.offsetLeft,
						offset_top = canvas.parentElement.offsetTop;
					// var img = new Image();
					// img.src = './images/guaing.png';
					function initCanvas(){
						// img.src = './images/guaing.png';
						// cnx.drawImage(img,0,0,canvas_w,canvas_h);
						// cnx.globalCompositeOperation = 'destination-out';
						// console.log(offset_left,offset_top)	
						
						cnx.globalCompositeOperation = "source-over";
						cnx.fillStyle = '#ffcbcb';
						cnx.fillRect(0,0,canvas_w,canvas_h);
						cnx.fill();
						
						cnx.font = "Bold 40px Arial";
						cnx.textAlign = "center";
						cnx.fillStyle = "#f7bdbd";
						cnx.fillText("刮奖区",canvas_w/2,canvas_h/2+15);
						cnx.globalCompositeOperation = 'destination-out';

						canvas.addEventListener('touchstart', eventDown)
						canvas.addEventListener('touchsend', eventUp)
						canvas.addEventListener('touchmove', eventMove)
						canvas.addEventListener('mouseDown', eventDown)
						canvas.addEventListener('mouseUp', eventUp)
						canvas.addEventListener('mouseMove', eventMove)
					}
					// img.addEventListener('load', function(){
						initCanvas();
					// })
					// 
					/**
					 * 定义半径radius 
					 * 	初始坐标x1,y1
					 *  行为标识
					 */
					var x1,y1

					var radius = 15

					var event_bool = false

					function eventDown(e){
						e.preventDefault();
						event_bool = true

						x1=e.touches[0].pageX - offset_left - document.querySelector('.game-wrapper').offsetLeft-radius/2;
      					y1=e.touches[0].pageY - offset_top - document.querySelector('.game-wrapper').offsetTop - radius/2;						
						cnx.save();
						cnx.beginPath()
						cnx.arc(x1,y1,radius,0,2*Math.PI);
						cnx.fill();
						cnx.restore();
					}
					function eventUp(e){
						e.preventDefault;
						event_bool = false
					}
					function eventMove(e){
						e.preventDefault();
  						if(event_bool){
  							var x=e.touches[0].pageX - offset_left - document.querySelector('.game-wrapper').offsetLeft;
      						var y=e.touches[0].pageY - offset_top - document.querySelector('.game-wrapper').offsetTop;
      						/**
      						 * 滑动画圆
      						 */
      						// cnx.beginPath();
					       //  cnx.arc(x, y, 15, 0, Math.PI * 2);
					       //  cnx.closePath();
					       //  cnx.fill();

					       /**
					        * 画圆和矩形 使得滑出的图形是连贯的
					        * @type {[type]}
					        */
					        var asin = radius*Math.sin(Math.atan((y-y1)/(x-x1)));
							var acos = radius*Math.cos(Math.atan((y-y1)/(x-x1)));
							var x3 = x1+asin;
							var y3 = y1-acos;
							var x4 = x1-asin;
							var y4 = y1+acos;
							var x5 = x+asin;
							var y5 = y-acos;
							var x6 = x-asin;
							var y6 = y+acos;
							
							cnx.save()
							cnx.beginPath()
							cnx.arc(x,y,radius,0,2*Math.PI);
							cnx.clip()
							cnx.clearRect(0,0,canvas.width,canvas.height);
							cnx.restore();
							
							cnx.save()
							cnx.beginPath()
							cnx.moveTo(x3,y3);
							cnx.lineTo(x5,y5);
							cnx.lineTo(x6,y6);
							cnx.lineTo(x4,y4);
							cnx.closePath();
							cnx.clip()
							cnx.clearRect(0,0,canvas.width,canvas.height);
							cnx.restore();
							
							x1 = x;
							y1 = y;



					        /**
					         * 计算已画区域像素点
					         */
					        var imgPixData = cnx.getImageData(0, 0, canvas_w, canvas_h).data;
					        for(var i = 0,pixelArea = 0;i < imgPixData.length;i+=4){
					        	if(imgPixData[i] && imgPixData[i+1] && imgPixData[i+2] && imgPixData[i+3]){
					        		pixelArea++;
					        	}
					        }
					        /**
					         * 区域少于整体的50%，自动隐藏
					         */
					        if(pixelArea < canvas_w*canvas_h*0.6){
					        	cnx.fillRect(0, 0, canvas_w,canvas_h);
      							cnx.fill();
      							document.querySelector('.after').style.zIndex = 10002;
      							RomoveEvent();//移除监控事件
					        }
  						}
					}					

					function RomoveEvent(){
						canvas.removeEventListener('touchstart', eventDown)
						canvas.removeEventListener('touchsend', eventUp)
						canvas.removeEventListener('touchmove', eventMove)
						canvas.removeEventListener('mouseDown', eventDown)
						canvas.removeEventListener('mouseUp', eventUp)
						canvas.removeEventListener('mouseMove', eventMove)
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
    @scratchCardHeight : 2.76rem;
    @titleHeight: .8rem;
    @btnWidth: 2.82rem;
	.game-wrapper.scrape{		
	    padding: .3rem;
	    background-position: center center;
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
   		.scrape_con{
			padding: .14rem .2rem;
			background: @white;
			font-family: Arial;
			height: @scratchCardHeight;
			box-sizing: content-box;
			position: relative;
			.before,.after{
				background: url(images/bg1.png) repeat-x left center;
			    background-size: auto 100%;
			    padding-bottom: .2rem;
			    padding-top: .16rem;
			    box-sizing: border-box;
			    .title{
			    	.ellipsis-line(2);
			    	/*.flexbox();
			    	.center();*/
			    	font-size: (@font-nm + 0.02rem);
					color: @white;
					width: 80%;
					text-align: center;
					margin: auto;
					line-height: 1.5;
					margin-bottom: 0.2rem;
					margin-top: .1rem;
					height: @titleHeight;
			    }
			}
			.before{
				z-index: @z-nm+1;
				.btm-msg{
					.prize-btn-box{
						position:relative;
						width: @btnWidth;
						display: block;
						margin: auto;
					}
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
					.ellipsis-line(2);
				}
				.title{
					color: #ef3030;
					.ellipsis-line(2);
				}
				.btm-msg{
					.text{
						color: #999;
					}
				}
			}
			.guaing{
				z-index: @z-nm;
			}
			.guaing,.after,.before{
				position: absolute;
				overflow: hidden;
				top: .14rem;
				bottom: .14rem;
				left: .2rem;
				right: .2rem;
			}
			.btm-msg{			
				margin: auto;
				position: relative;
				.prize-btn{
					width: @btnWidth;
					display: block;
					margin: auto;
				}
				.text{
					color: #ececec;
					font-size: (@font-sm + 0.02rem);
					margin-bottom: .14rem;
					text-align: center;
					height: @font-nm;
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
				font-size: (@font-sm + 0.02rem);
				text-align: center;
				margin-bottom: 0.6rem;
			}
	    }
   	}
</style>