/**
* cms促销页，底部导航，列表项
* @Author: zhaoye-ds1
* @Date: 2016-05-30 10:00
* @Last-Modified-Date: 2016-05-30 13:21
* @Last-Modified-By: zhaoye-ds1
*/
<template>
    <a @touchstart.stop="onSelect" @touchend.stop="endSelect" @touchcancel="endSelect" class="item" :class="{'active': isHighlight}" :href="href" style="position:relative" v-if="idx<=4" @click="show">
        <div v-if="data.pattern=='2'" class="mask" :style="masksize" v-show="mask" transition="fade"></div>
        <div class="img">
            <img v-show="!isHighlight" :src="data.defaultImageUrl">
            <img v-show="isHighlight" :src="data.selectImageUrl">
        </div>
        <h4 :style="{color : fontColor}">{{data.promsName}}</h4>
        <div v-if="data.pattern=='1'"  class="triangle" v-show="bottom" transition="triangle"></div>
        <div v-if="data.pattern=='2'" class="arrow" v-show="bottom" transition="triangle"></div>
        <menu v-if="data.pattern=='1'" v-ref:pop :data="sublist" :column="data">

        </menu>
    </a>
    <menu v-if="data.pattern=='2'" v-ref:pop :data="sublist" :column="data">

    </menu>
</template>
<script type="text/javascript">
    import Transformer from '../../utils/dataTransformer.js'
    import Menu from './popMenu.vue'
    export default ({
        props: ['data','idx','info','fcolor','fcolorActive','sublist'],
        components:{
            'menu': Menu
        },
        data: function(){
            return {
                href: '',
                isHighlight: false,
                domain: 'http://m.gome.com.cn',
                bottom:'',
                mask:'',
                masksize: {
                    width: document.documentElement.offsetWidth+'px',
                    height: (document.documentElement.offsetHeight - 94)+'px',
                }
            }
        },
        computed: {
            href: function(){
                if(this.data.plugId && this.data.plugId.replace('_cms','') == this.info.keyProms){
                    return Transformer.transHref(this.data)
                }else if(this.data.plugId){
                    return Transformer.transHref(this.data)
                }else if(!this.data.plugId && this.data.promsUrl){
                    return this.data.promsUrl
                }else{
                    if(this.data.promsType == 8){
                        return this.domain+'/film.html'
                    }else if(this.data.promsType == 13){
                        return this.domain+'/meiyingbao.html'
                    }else if(this.data.promsType == 21){
                        return this.domain+'/finance-crowdfund.html'
                    }else if(this.data.promsType == 33){
                        return this.domain+'/finance-index.html'
                    }else if(this.data.promsType == 34){
                        return this.domain+'/licai_bill_list-010-000.html'
                    }else if(this.data.promsType == 35){
                        return this.domain+'/licai_p2p_list-020-000.html'
                    }else if(this.data.promsType == 36){
                        return this.domain+'/licai_gs_list-040-000.html'
                    }else if(this.data.promsType == 37){
                        return this.domain+'/finance-baina.html'
                    }else if(this.data.promsType == 40){
                        return this.domain+'/recharge.html'
                    }else if(this.data.promsType == 54){
                        return 'javascript:;'
                    }
                }
            }
        },
        created: function(){
            //给href赋值
            var self = this
            navigator.gome.util.nativeUtils.getAppEnvironment(function(data){
                data = typeof data == 'string' ? JSON.parse(data) : data
                data.environment = data.environment.toLowerCase();
                if(data.environment == 'uat'){
                    self.domain = 'http://m.atguat.com.cn'
                }
            })
            this.$set('fontColor', this.fcolor)
            this.$watch('isHighlight',function(isHighlight){
                if(isHighlight){
                    this.fontColor = this.fcolorActive
                }else{
                    this.fontColor = this.fcolor
                }
            })
        },
        methods:{
            hide: function () {
                this.$refs.pop.showpop(0)
                this.bottom=0
                this.mask=0
            },
            tabs: function () {
                // tab选项卡不同数量浮层位置
                var winWth = window.innerWidth,
                    navLen =document.querySelectorAll('.item').length,
                    this_menu =document.querySelector('.pop-menu-box'),
                    firstMenu =document.querySelector('.item:nth-child(1) .pop-menu-box'),
                    lastMenu =document.querySelector('.item:last-child .pop-menu-box');

                if(navLen==2){
                    this_menu.style.left='50%'
                    this_menu.style.webkitTransform='translateX(-50%)'
                }
                if(navLen==3){
                    if(winWth>600){
                        this_menu.style.left='50%'
                        this_menu.style.webkitTransform='translateX(-50%)'
                    }else{
                        if(firstMenu){
                            this_menu.style.left='.2rem'
                        }else if(lastMenu){
                            this_menu.style.right='.2rem'
                        }else{
                            this_menu.style.left='50%'
                            this_menu.style.webkitTransform='translateX(-50%)'
                        }
                    }


                }
                if(navLen==4){
                    if(winWth>600){
                        this_menu.style.left='50%'
                        this_menu.style.webkitTransform='translateX(-50%)'
                    }else{
                        if(firstMenu){
                            this_menu.style.left='.2rem'
                        }else if(lastMenu){
                            this_menu.style.right='.2rem'
                        }else{
                            this_menu.style.left='50%'
                            this_menu.style.webkitTransform='translateX(-50%)'
                        }
                    }
                }
                if(navLen==5){
                    if(firstMenu){
                        this_menu.style.left='.2rem'
                    }else if(lastMenu){
                        this_menu.style.right='.2rem'
                    }else{
                        this_menu.style.left='50%'
                        this_menu.style.webkitTransform='translateX(-50%)'
                    }
                }
            },
            show:function(){
                if(this.data.promsType == 54){
                    if(this.bottom==''||this.bottom=='0'){
                        this.$refs.pop.showpop(1)
                        this.bottom=1
                        this.mask=1
                        if(this.data.pattern==1){
                            this.tabs()
                        }
                    }
                }
            },
            onSelect: function () {
                this.isHighlight = true
            },
            endSelect: function() {
                this.isHighlight = false
            }
        },
    })
</script>
<style lang="less">
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    nav {
    &.bottom {
    .item {
    .flexitem(1);
    .flexbox();
    .flexbox.vertical();
    .flexbox.center();
    .img {
    .flexbox();
    .flexbox.h_center();
    img {
        width: .5rem;
        height: .5rem;
        margin-bottom: .1rem;
    }
    }
    h4 {
        text-align: center;
        font-size: @font-nm-sm;
    }
    .triangle{
        width: @font-sm;
        height: @font-sm;
        background:@white;
        position: absolute;
        bottom:@font-sm*5.3;
        left: 50%;
        margin-left: -.1rem;
        transform:rotate(45deg);
        box-shadow: (@font-sm*0.1) (@font-sm*0.1) (@font-sm*0.1) rgba(0,0,0,0.1);
        opacity:0;
        z-index: 1;
    }
    .arrow{
        width: @font-sm;
        height: @font-sm;
        background:@white;
        position: absolute;
        bottom:@font-sm*5.3;
        left: 50%;
        margin-left: -.1rem;
        transform:rotate(45deg);
        opacity:0;
        z-index: @z-mid+10;
    }
    .triangle-transition{
        opacity:1;
        transition:all .05s .05s;
    }
    .triangle-enter{
        opacity:0;
    }
    .triangle-leave{
        opacity:0;
        transition:all .1s;
    }
    }
    .mask{
        background-color: #000;
        position: fixed;
        left: 0;
        bottom: .94rem;
        opacity:0;
        z-index: @z-mid;
    &.fade-transition{
         opacity: 0.5;
         transition:all .3s;
     }
    &.fade-enter{
         opacity:0
     }
    &.fade-leave{
         opacity:0
     }
    }
    }
    }

</style>
