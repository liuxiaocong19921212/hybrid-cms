//tagGoodsList.scroll.vue
<template>
    <div v-show="this.data.tagGoodsList.length > 0" :class="className">
        <div class='blocker' :style="fixBlocker"></div>
        <tab-nav-scroll v-ref:tab
            v-if="data.tagGoodsList.length > 3.5"
            :list="data.tagGoodsList"
            :options="optionsTab"
            :style="fix">
        </tab-nav-scroll>
        <tab-nav v-ref:tab
            v-else
            :list="data.tagGoodsList"
            :options="optionsTab"
            :style="fix">
        </tab-nav>
        <swiper v-bind:options="options"  v-bind:list="data.tagGoodsList" v-bind:style='[style]'>
           <slider v-ref:sliders v-for="(index, item) in data.tagGoodsList" v-bind:options="options" slot="slider">
            <div v-show="idx == index" v-if="data.tagGoodsList[index].tagImg" class="tagIllustration">
                <a :href="adHref(data.tagGoodsList[index])">
                    <img :src="data.tagGoodsList[index].tagImg">
                </a>
            </div>
            <products
                v-ref:product
                :page-info="pageInfo"
                :data="item"
                :idx="index"
                :type='"inScrollListHasTimeInfo"'
                :show-cart-flag="data.showCartFlag"
                :show-button-flag="data.showButtonFlag"
                :triangle-tag-style="data.superscriptStyle">
            </products>
            <!--<p>
               {{btmToNextTips[index]}}
            </p>-->
            <p v-if="!cntr[index]" class="loading-tip">
                <small>{{loadingTip}}</small>
               <!--<i style="background-image:url(../../../b/components/src/core/images/loading.gif)"></i>-->
            </p>
           </slider>
        </swiper>
    </div>
</template>
<script>
    import Transformer from '../../utils/dataTransformer.js'
    import comps from 'components'
    import goodsTemplet from '../goods/goodsTemplet.js'
    export default ({
        components: {
            'tab-nav-scroll': comps.TabNavScroll,
            'tab-nav': comps.TabNav,
            'swiper': comps.Swiper,
            'slider': comps.Slider,
        },
        data: function(){
            return {
                idx: 0,
                style: {
                    'height': 'auto',
                    'minHeight': 'auto'
                    /*'transition': 'height .3s'*/
                },
                options: {
                    'autoPlay': false,
                    'loop': false,
                    'perSliders': 1,
                    'wrapperWidth': document.body.offsetWidth
                },
                optionsTab: {
                    'autoPlay': false,
                    'loop': false,
                    'perSliders': 3.5,
                    'wrapperWidth': document.body.offsetWidth
                },
                cellHeight: 0,
                children: {},
                cntr: {
                    '0': true,
                },
                fixBlocker: {
                    'height': 0
                },
                fix: {
                    'position': 'inherit',
                    'top': 0,
                    'z-index': 9999,
                    '-webkit-transform': 'translateZ(0)',
                    '-moz-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',
                },
                priceStore:{},
                btmToNextTips: [],
                mustBackTop: false,
                loadingTip: '加载中...'
            }
        },
        events: {
            clickOne: function(idx){
                this.$broadcast('scrollTo',idx)
            },
            btmToNext: function(){
                if(this.idx<this.data.tagGoodsList.length-1){
                    this.idx++
                    this.mustBackTop = true
                    this.$broadcast('setActive',this.idx)
                }
            },
            isBtmToNextOk: function(ok){
                if(this.idx < this.data.tagGoodsList.length-1){
                    if(ok){
                        this.$set('btmToNextTips['+this.idx+']','松开加载更多')
                    }else{
                        this.$set('btmToNextTips['+this.idx+']','上滑加载更多')
                    }
                }else{
                    this.$set('btmToNextTips['+this.idx+']','')
                }
            },
            scrollTo: function(idx){
                //通知tab切换
                this.$broadcast('setActive',idx)
                //回顶
                if(this.$el.querySelector('.blocker').getBoundingClientRect().top<0 && (idx != this.idx || this.mustBackTop))
                    window.scrollTo(0,this.$el.querySelector('.blocker').offsetTop)
                this.mustBackTop = false
                this.idx = idx
                var self = this
                if(this.cntr[idx]){
                    this.setSliderHeight(idx)
                    return
                }
                this.loadingTip = '加载中...'
                if(this.data.tagGoodsList[idx].catalogId){
                    this.getPageBigData(idx)
                }else{
                    this.getPagePromscms(idx)
                }
            }
        },
        created: function(){
            if(this.data.tagGoodsList.length == 0)return
            this.style.minHeight =  '150px'
            //ugly-fix
            if(this.data.displayColor){
                var style = document.createElement('style')
                //标签颜色的dirty实现
                style.innerHTML =    '#templet'+this.options.templetIdx+' .tab-nav li.active:not(:only-child){'
                                    +'  color:'+this.data.displayColor+' !important;'
                                    +'  border-bottom-color:'+this.data.displayColor+' !important;'
                                    +'}'
                                    /*+'#templet'+this.options.templetIdx+' .list{'
                                    +'  background-color:'+this.data.goodsBackColor+' !important;'
                                    +'}'*/
                document.head.appendChild(style)
            }
            if(this.data.goodsBackColor){
                var style2 = document.createElement('style')
                //列表背景色的dirty实现
                style2.innerHTML =    '#templet'+this.options.templetIdx+' .swiper-container{'
                                    +'  background-color:'+this.data.goodsBackColor+' !important;'
                                    +'}'
                                    //列表背景色的dirty实现
                document.head.appendChild(style2)
            }
            this.$watch('cellHeight',function(){
                this.$nextTick(function(){
                    //计算加入插图高度
                    //this.style.height = this.cellHeight+'px'
                })
            })
            if(this.data.tagGoodsList[0].catalogId){
                this.getPageBigData(0);
            }else{
                this.getPagePromscms(0);
            }
        },
        ready: function(){
            var _scope = this;
            window.addEventListener('scroll',function(){
                var $blocker = _scope.$el.querySelector('.blocker')
                var rect = $blocker.getBoundingClientRect()
                if(rect.top < 0){
                    _scope.$refs.tab.$el.style.position = 'fixed'
                    $blocker.style.height = _scope.$refs.tab.$el.offsetHeight+'px'
                }else if(rect.top >= 0){
                    _scope.$refs.tab.$el.style.position = 'inherit'
                    $blocker.style.height = 0+'px'
                }
            })
        },
        methods: {
            reWriteUrl:function(ele){
                var aLinks = ele.getElementsByTagName('a');
                var cnt = 0;
                for(var n = 0; n < aLinks.length; n++){
                    var aLinks_href = aLinks[n].getAttribute('href');
                    if(aLinks_href && aLinks_href.match(/^\/\//)){
                        cnt++
                        aLinks[n].setAttribute('params', 'prom-' + this.data.tagGoodsList[this.idx].moduleId + '-' + cnt)
                        aLinks_href = aLinks_href.indexOf('?')>-1 ? aLinks_href+'&intcmp='+('prom-' + this.data.tagGoodsList[this.idx].moduleId + '-' + (cnt)) : aLinks_href+'?intcmp='+('prom-' + this.data.tagGoodsList[this.idx].moduleId + '-' + (cnt))
                        aLinks[n].setAttribute('href',aLinks_href)
                        if(aLinks[n].querySelector('a') || aLinks[n].querySelector('button')){
                            if(aLinks[n].querySelector('a')){
                                for(var x = 0;x < aLinks[n].querySelectorAll('a').length;x++){
                                    aLinks[n].querySelectorAll('a')[x].setAttribute('params', 'prom-' + this.data.tagGoodsList[this.idx].moduleId+ '-' + (cnt))
                                }
                            }else{
                                for(var y = 0;y < aLinks[n].querySelectorAll('button').length;y++){
                                    aLinks[n].querySelectorAll('button')[y].setAttribute('params', 'prom-' + this.data.tagGoodsList[this.idx].moduleId + '-' + (cnt))
                                }
                            }
                        }
                    }
                }
            },
            setSliderHeight: function(idx){
                this.$nextTick(function(){
                    for(var i=0; i<this.$refs.sliders.length; i++){
                        this.$refs.sliders[i].$el.style.height = '0px'
                        if(this.cntr[i])
                            this.$refs.sliders[i].$el.style.visibility = 'hidden'    
                    }
                    this.$refs.sliders[this.idx].$el.style.height = 'auto'
                    this.$refs.sliders[this.idx].$el.style.visibility = 'visible'
                    this.reWriteUrl(this.$refs.sliders[this.idx].$el);
                })
                this.$set('cntr['+idx+']',true)
            },
            adHref: function(data){
                return Transformer.transHref(data)
            },
            getPageBigData: function(idx){
                var catalogLevel = this.data.tagGoodsList[idx].catalogLevel
                var catalogId = this.data.tagGoodsList[idx].catalogId
                $g.Promise.all([$g.getAddress(), $g.getUniqueId()])
                .then(function(data){
                    var address = data[0];
                    var uid = data[1];
                    var param = {
                        cid: uid || '',
                        from: 'app',
                        area: address.district.code,
                        imagesize: '160',
                        pagesize: '20',
                        currentpage: '1',
                    };
                    if(catalogLevel == 1){
                        param['c1id'] = catalogId;
                        param.boxid = 'box322';
                    }else if(catalogLevel == 3){
                        param['c3id'] = catalogId;
                        param.boxid = 'box323';
                    }
                    return  $g
                            .http({
                                url: Transformer.transEnv('http://bigd.gome.com.cn/gome/rec'),
                                type: 'jsonp',
                                isPostBody: 'N',
                                isNeedLoading: 'N', 
                                data: param
                            });
                })
                .then(function(data){
                    var data = Transformer.transBigDataGoods(data);
                    try{
                        this.$set('data.tagGoodsList['+idx+'].goodsList',data.goodsList);
                    }catch(e){
                        this.loadingTip = '加载失败...'
                    }
                    if(data.goodsList.length == 0){
                        this.loadingTip = '加载失败...'
                    }
                    setTimeout(function(){
                        this.setSliderHeight(idx)
                    }.bind(this), 100)
                }.bind(this))
                .catch(function(e){
                    console.log('惜败')
                }.bind(this));
            },
            getPagePromscms: function(idx){
                $g.http({
                    "url": ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://prom-mobile.gomeplus.com/mobile/promotion/promscms/pagePromscms.jsp') : Transformer.transEnv('http://prom.mobile.gome.com.cn/mobile/promotion/promscms/pagePromscms.jsp'),
                    "type":"POST",
                    "data":{
                        "keyProms":this.pageInfo.keyProms,
                        "templetId": this.data.templetId,
                        "moduleId": this.data.tagGoodsList[this.idx].moduleId,
                        "provinceId": window.provinceId || "",
                        "cityId": window.cityId || "",
                    },
                    "isNeedLoading":"N"
                })
                .then(function(result){
                    var temp =  this.data.tagGoodsList[idx]
                    temp.goodsList = Transformer.transGoods(result.goodsList, this.data.templetType)
                    //补值，这个很重要
                    temp.templetType = this.data.templetType
                    temp.templetId = this.data.templetId
                    this.$set('data.tagGoodsList['+idx+']',temp);
                    setTimeout(function(){
                        this.setSliderHeight(idx)
                        //添加proms属性
                    }.bind(this), 100);
                }.bind(this))
                .catch(function(){
                    console.log('惜败')
                }.bind(this))
            }
        }
    })
</script>
<style lang="less">
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    .swiper-container {
        .loading-tip {
            .flexbox();
            .flexbox.center();
            height: 1rem;
            i {
                .background-image-nm('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
                display: block;
                height: .6rem;
                width: .6rem;
            }
        }
        small {
            font-size: @font-nm-sm;
            color: @gray-light;
        }
    }
    .tagIllustration img{
        //min-height: .8rem;
        //max-height: 1.6rem;
    }
</style>
