/**
 * 店铺单品的入口
 * @Author zhaoye
 * @Created-Date: 2016-10-31
 * @Last-Modefied-Date: 2016-11-01
 * @Last-Modefied-By: zhaoye
 */
<template>
    <div class="shop-single" v-if="isShow">
        <!--整体模块的标题-->
        <h3 :style="[titleColor, titleBG]" v-if="data.displayName">
            <!--主标题-->
            <i :style="titleColor" class="line"></i>
            <cimg :bg="'N'" :src="data.logoImgUrl"></cimg><span class="title">{{data.displayName}}</span>
            <i :style="titleColor" class="line"></i>
            <!--次要标题-->
            <a v-if="data.templetPromo" :href="data.promsUrl || 'javascript:;'" class="subtitle">
               {{data.templetPromo}}<i data-icon="&#x00A3" :style="titleColor"></i>
            </a>
        </h3>
        <!--店铺模块列表-->
        <div v-if="!shop.hide && !!shop.goodsList" class="shop" v-for="(index, shop) in data.shopSingleProductBeanList">
        <!--店铺-->
            <a :href="shopHref(shop)">
            <!--店铺主图-->
                <div class='banner'>
                    <cimg :default="'3x1'" :src="shop.imageUrl"></cimg>
                </div>
            </a>
            <!--店铺商品列表-->
            <scroller v-if="shop.goodsList" :options="options" >
                <product v-if="index <= 9" :class="(index == shop.goodsList.length - 1) ? 'last' : ''" v-for="(index, item) in shop.goodsList | orderBy  'sortFactor' -1" :data="item.transformed" :width="width">
                    <div slot="content">
                        <div class="price">
                            <p class="name">{{item.transformed.name}}</p>
                            <strong><span v-if="item.transformed.price != '敬请期待'">&yen;</span>{{item.transformed.price}}</strong>
                            <small v-if="shop.whetherDisplayed == 'Y' && shop.shopProductSort == 0 && item.origin.viewnum">浏览量：{{item.origin.viewnum}}</small>
                            <small v-if="shop.whetherDisplayed == 'Y' && shop.shopProductSort == 1 && item.origin.salenum">销量：{{item.origin.salenum}}</small>
                        </div>
                    </div>
                </product>
                <!--更多-->
                <more  v-if="shop.goodsList.length >= 9" v-if="shop.goodsList.length >= 9" @jump='jump(shop.shopId)'></more>
            </scroller>
        </div>
    </div>
</template>
<script>
    /**
     * 组件库
     */
    import comps from 'components'
    /**
     * 商品的价格处理器
     */
    import priceGetter from '../goods/goods.mixin.vue'
    /**
     * 数据转换器
     */
    import Transformer from '../../utils/dataTransformer.js'
    /**
     * 组件
     */
    export default(
        Vue.extend({
            components: {
                'scroller': comps.Scroller,
                'more': comps.ScrollerMore,
                'product': comps.Product.Default,
                'cimg': comps.Image,
            },
            data: function(){
                return {
                    /**
                     * 整个模块是否显示
                     * @type {Boolean}
                     */
                    isShow: false,
                    /**
                     * 标题的颜色属性
                     * @type {Object}
                     */
                    titleColor: {
                        color: '',
                        borderColor: '',
                    },
                    /**
                     * 标题的背景
                     * @type {Object}
                     */
                    titleBG: {
                        backgroundImage: ''
                    },
                }
            },
            created: function(){
                //遍历商铺初始化
                this.data.shopSingleProductBeanList.forEach(function(shop, idx){
                    this.initShop(shop, idx);
                }.bind(this));
                
                //给title设置样式
                this.titleColor.color = this.data.displayColor;
                this.titleColor.borderColor = this.data.displayColor;
                this.titleBG.backgroundImage = 'url('+this.data.backImgUrl+')';
                
                //判断title的背景图的显示时间
                if(this.data.backImgStartTime){
                    var startTime = this.data.backImgStartTime;
                    var now = new Date().getTime();
                    var endTime = this.data.backImgEndTime ? this.data.backImgStartTime : null;
                    if(now < startTime || (endTime && now > endTime)){
                        this.titleBG.backgroundImage = '';
                    }
                }
            },
            methods: {
                /**
                 * 初始化商铺
                 * @param  {jsonObj} shop 商铺数据
                 * @param  {int}     idx  返回的数据里面的商铺序号
                 * @return null
                 */
                initShop: function(shop, idx){
                    //判断显隐
                    if(shop.startDate){
                        var startTime = new Date(shop.startDate.replace(/-/,'/')).getTime();
                        var now = new Date().getTime();
                        var endTime = shop.endDate ? new Date(shop.endDate.replace(/-/,'/')).getTime() : null;
                        if(now > startTime){
                            shop.hide = false;
                        }                    
                        if(endTime && now > endTime){
                            shop.hide = true;
                            return;
                        }
                    }else{
                        shop.hide = true;
                        return;    
                    }
                    //调取大数据接口
                    this
                    .getBigData(shop)
                    .then(function(bigDataGoodsList){
                        if(bigDataGoodsList.lst && bigDataGoodsList.lst.length > 0){
                            this.isShow = true;
                        }
                        var goodsList = Transformer.transBigDataGoods(bigDataGoodsList).goodsList.map(function(item){
                                //浏览量
                                if(shop.shopProductSort == 0){
                                    item.sortFactor = item.origin.viewnum
                                }else {
                                //销量
                                    item.sortFactor = item.origin.salenum
                                }
                                return item
                            });
                        //数据结构转换
                        //改变vm，重绘dom树
                        this.$set('data.shopSingleProductBeanList['+idx+'].goodsList',goodsList);
                    }.bind(this))
                    .catch(function(){
                        //调取失败隐藏商铺
                        shop.hide = true;
                    }.bind(this))
                },
                /**
                 * 跳转到店铺页
                 * @param  {string} shopId 商铺id
                 * @return null
                 */
                jump: function(shopId){
                    window.jump('http://m.gome.com.cn/shop-' + shopId + '.html');
                },
                /**
                 * 调取大数据接口
                 * @param  {jsonObj} shop     cms接口返回的店铺数据结构
                 * @return {Promise} $g.http  发起请求的promise对象
                 */
                getBigData: function(shop){
                    return $g.Promise.all([$g.getUniqueId(),$g.getAddress()])
                    .then(function(data){
                        var cid = data[0]
                        var address = data[1]
                        var area = address.district.code
                        return $g.http({
                            isNeedLoading: "N",
                            isPostBody: 'Y',
                            url: Transformer.transEnv('http://bigd.gome.com.cn/gome/rec'),
                            type: 'jsonp',
                            data: {
                                area: area,
                                boxid: 'box316',
                                cid: cid || '',
                                currentpage: '0',
                                shopid: shop.shopId,
                                from: 'app',
                                imagesize: '160',
                                pagesize: '20',
                                uni: 'box316'
                            }
                        })
                    }.bind(this))
                },
                /**
                 * 拼接商铺的链接
                 * @param  {jsonObj} shop cms返回的店铺的数据结构
                 * @return {string}       商铺的url地址
                 */
                shopHref: function(shop){
                    return Transformer.transEnv("http://m.gome.com.cn/shop-" + shop.shopId + ".html")
                },
            }
        })
    )
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@title-margin: .25rem;
@title-img-size: .38rem;
@title-height: .8rem;
.shop-single {
    h3 {
        position: relative;
        height: .66rem;
        background-color: @white;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: @font-nm;
        .set-line-height(1;@title-height);
        .flexbox();
        .flexbox.center();
        .line {
            width: .6rem;
            height: 0;
            border-top: 1px solid @gray;
            &:first-child {
                margin-right: @title-margin;
            }
        }
        img {
            display: inline-block;
            width: @title-img-size;
            height: @title-img-size;
            margin-right: @title-margin / 2;
        }
        .title {
            margin-right: @title-margin;
        }
        .subtitle {
            position: absolute;
            right: .24rem;
            display: inline-block;
            font-size: @font-nm-sm;
            color: @gray;
            .set-line-height(1;@title-height);
            i {
                display: inline-block;
                -webkit-transform: translateY(-2.5%);
                transform: translateY(-2.5%);
            }
        }
    }
    .shop {
        margin-bottom: .3rem;
        background-color: @white;
    }
    .product {
        &.last {
            .img {
                border: none !important;
            }
        }
        width: auto;
        margin-bottom: 0;
        .container {
            text-align: center;
            width: 2rem;
            &.img {
                background-color: @white;
                padding-right: .1rem;
                margin: .3rem .2rem .3rem .3rem;
                width: 1.4rem;
                box-sizing: content-box;
                border-right: 1px dashed @gray-dark-border;
            }
            &.content {
                margin-bottom: .08rem;
                .name {
                    margin-bottom: .08rem;
                    .flexitem(1);
                    .ellipsis-line(1);
                    .set-line-height(1;@font-nm-sm);
                    padding: 0 .3rem;
                    font-size: @font-nm-sm;
                    color: @gray-dark;
                }
                .price {
                    margin-bottom: .1rem;
                }
                strong {
                    display: inline-block;
                    margin-right: @font-sm * 0.5;
                    .set-line-height(1;@font-nm);
                    font-size: @font-nm;
                    color: @gray-dark;
                }
                small {
                    font-size: @font-nm-sm;
                    display: block;
                    color: @gray-light;
                    .set-line-height(1; @font-nm-sm * 2);
                }
                .tag {
                    margin-right: .06rem;
                }
                .info {
                    font-size: @font-sm;
                    color: @gray-light;
                }
                del {
                    display: inline-block;
                    color: @gray-light;
                    font-size: @font-nm-sm;
                }
            }
        }
    }
}
</style>