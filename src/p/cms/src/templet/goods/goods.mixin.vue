<script>
    import Transformer from '../../utils/dataTransformer.js'
    export default ({
        props: ['pageInfo','data','type','idx','showCartFlag','showButtonFlag'],
        created: function(){
            //目前观察了下，在自组件里，父组件的数据发生变化时
            //当父组件$set后，父组件开始监控空数据
            //但是自组件并没有开始监控
            //需要子组件在初始化的时候强制监控一下才能实现父子监控联动
            this.$set('data.goodsList',this.data.goodsList)
            if(this.data.showCartFlag){
                this.$set('showCartFlag',this.data.showCartFlag)
            }
        },
        events:{
            addCart:function(commodity){
                /*
                 * 判断登录
                 */
                $g.getUserInfo()
                .catch(function(){
                    $g.login()
                    return 'pass'
                 })
                .then(function(data){
                    if(data == 'pass')
                        return data
                    else
                        return $g.getAddress();
                })
                .then(function(address){
                    if(address == 'pass'){
                        return address
                    }
                    var addrCode = address.province.code + address.city.code + address.district.code + address.town.code;
                    /**
                     * 获取四级地址
                     */
                    return $g.http({
                        "url": ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://mobile.gomeplus.com/mobile/order/cart/cartAdd.jsp') :   Transformer.transEnv('http://mobile.gome.com.cn/mobile/order/cart/cartAdd.jsp'),
                        "type": "post",
                        "data": {
                            "skuID": commodity.skuId,
                            "goodsNo": commodity.goodsNo,
                            "number": "1",
                            "goodsType": commodity.goodsType,
                            "districtCode": addrCode,
                        },
                        "isNeedLoading": "N"
                    })
                })
                .then(function(data){
                    if(data == 'pass'){
                        return data
                    }
                    data = typeof data == 'string' ? JSON.parse(data) : data;
                    if (data.isSuccess == 'Y') {
                        $g.toast('添加购物车成功');
                    }else{
                        $g.toast(data.failReason);
                    }
                })
                .catch(function(err){
                    $g.toast(err.failReason || '请求失败');
                });
            }
        },
        methods: {
            getPriceStatus: function(){
                if(!this.pageInfo || !this.data.templetId)return;
                $g.http({
                    url: ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://prom-mobile.gomeplus.com/mobile/promotion/promscms/singleTemplet.jsp') : Transformer.transEnv('http://prom.mobile.gome.com.cn/mobile/promotion/promscms/singleTemplet.jsp'),
                    type: 'post',
                    data: {
                        "keyProms":this.pageInfo.keyProms,
                        "templetId": this.data.templetId,
                        "provinceId": window.provinceId || "",
                        "cityId": window.cityId || "",
                        "isFilter": "N",
                        "extendParams":{"uid":""}
                    },
                    "isNeedLoading":"N"
                }).then(function(data){
                    this.ok(data)
                }.bind(this))
            },
            ok: function(data){
                data = typeof data == 'string' ? JSON.parse(data) : data
                var goodsList
                if(data.templetList[0].dailyGoodsTemplet){
                    goodsList = data.templetList[0].dailyGoodsTemplet.goodsList
                }else if(data.templetList[0].tagGoodsListTemplet){
                    goodsList = data.templetList[0].tagGoodsListTemplet.tagGoodsList[this.idx].goodsList
                }else{
                    goodsList = data.templetList[0].goodsTemplet.goodsList
                }
                goodsList = Transformer.transGoods(goodsList, goodsList.templetType, goodsList.templetId)
                this.data.goodsList = goodsList
                this.transTime(goodsList, this.data.templetType, goodsList.templetId)
                this.$emit('onPriceGet')
            },
            buyingSmart: function(){
//暂时去掉比价
//@liuxiaocong
//@time: 2016/11/02
                return;
                if(!$g.env.live)return;
                $g.http({
                    url: Transformer.transEnv('http://api.search.gome.com.cn/p/smartBuy'),
                    type: 'jsonp',
                    data: {
                                "from":'wap_congminggou',
                                "smartFlag": 2,
                                "skuId": encodeURI(JSON.stringify(this.data.goodsList.map(function(item){
                                   return item.goodsBean.skuID
                                }))),

                     },
                     isPostBody: 'N'
                }).then(function(data){
                    this.buyingSmartResult(data);
                }.bind(this));
            },
            buyingSmartResult: function(data){
                data = typeof data == 'string' ? JSON.parse(data) : data 
                this.$emit('buyingSmart',data)
                function isEmpty(obj){
                    var cnt = 0
                    for(var key in obj){
                        cnt++
                    }
                    return !cnt ? true : false
                }
                var self = this
                data.forEach(function(item,idx){
                    if(isEmpty(item))return
                    var targetPrice = 0
                    var compare = {}
                    if(item.jd.length > 0 && item.suning.length > 0){
                        try{
                            var jdp =  Number(item.jd[0].price.replace(/^￥/,''))
                        }catch(e){
                            var jdp = 0
                        }
                        try{
                            var snp = Number(item.suning[0].promotion_price.replace(/^￥/,''))
                        }catch(e){
                            var snp = 0
                        }
                        if(jdp > snp){
                            compare.competitor = '京东'
                            targetPrice = jdp
                        }else{
                            compare.competitor = '苏宁'
                            targetPrice = snp
                        }
                    }else{
                        if(item.jd.length > 0){
                            try{
                                targetPrice = Number(item.jd[0].price.replace(/^￥/,''))
                                compare.competitor = '京东'
                            }catch(e){

                            }
                        }else{
                            try{
                                targetPrice = Number(item.suning[0].promotion_price.replace(/^￥/,''))
                                compare.competitor = '苏宁'   
                            }catch(e){

                            }
                        }
                    }
                    var price = self.data.goodsList[idx].transformed.price
                    if(price < targetPrice){
                        compare.competitorPrice = targetPrice
                        compare.discountPrice =  targetPrice - price
                        compare.discountPrice =  String(compare.discountPrice).match(/\.\d{2}\d+/) ? compare.discountPrice.toFixed(2).replace(/0$/,'') : compare.discountPrice
                    }
                    compare.lastModifiedTime = item.lastModifiedTime.replace(/\d{4}-/,'')
//暂时去掉比价
//@liuxiaocong
//@time: 2016/11/02
                    compare.discountPrice = 0
                    self.$set('data.goodsList['+idx+'].transformed.compare',compare)
                })
            },
            transTime: function(goodsList, templetType, templetId){
                this.$nextTick(function(){
                    var transed = Transformer.transGoods(goodsList, templetType, templetId)
                    for(var i=0; i<transed.length; i++){
                        var item = transed[i]
                        var now = new Date().getTime()
                        try {
                            if(!item.goodsBean.priceBean.endDate && !!item.goodsBean.priceBean.delayEndTime){
                                this.data.goodsList[i].transformed.end = now + item.goodsBean.priceBean.delayEndTime*1000
                            }else{
                                this.data.goodsList[i].transformed.end = item.goodsBean.priceBean.endDate || now//  Number(new Date().getTime())+300000//
                            }
                            if(!item.goodsBean.priceBean.endDate && !!item.goodsBean.priceBean.delayTime){
                                this.data.goodsList[i].transformed.start = now + item.goodsBean.priceBean.delayTime*1000
                            }else{
                                this.data.goodsList[i].transformed.start =  item.goodsBean.priceBean.startDate || now
                            }
                            for(var key in item.transformed){
                                if(item.transformed[key]){
                                    this.data.goodsList[i].transformed[key] = item.transformed[key]
                                }
                            }
                        } catch (e) {

                        } finally {

                        }
                    }
                });
            }
        }
    })
</script>
