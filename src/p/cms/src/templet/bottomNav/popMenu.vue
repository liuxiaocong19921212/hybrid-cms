/**
* cms底部导航浮层
* @Author: lichengjuan
* @Date: 2016-08-09 10:00
* @Last-Modified-Date: 2016-08-10 13:21
* @Last-Modified-By: lichengjuan
*/
<template>
    <!--图文-->
    <div @click="hide" v-if="column.pattern=='1'" class="pop-menu-box" v-show="show" transition="expand" @touchmove="menuTouch($event)">
        <ul class="pop-menu">
            <li v-for="(index,item) in data" v-if="index<='5'"  @click="hide">
                <a :href="item.href != 'javascript:;' ? item.href : item.promsUrl" :style="{color:item.titleColor}" >
                    <i style="background-image: url('{{encodeURI(item.pic)}}')"></i>
                    <span class='str-len'>{{item.title}}</span>
                </a>
            </li>
        </ul>
    </div>
    <!--图片-->
    <div @click="hide" v-if="column.pattern=='2'" class="pop-up-box" v-show="show" transition="bounce" @touchstart="touchStart" @touchmove="scroll($event)">
        <ul :style="pos">
            <li v-for="item in data" :class="checkPattern(item.picPattern)">
                <a :href="item.href != 'javascript:;' ? item.href : item.promsUrl">
                    <img :src="item.pic">
                </a>
            </li>
        </ul>
    </div>

</template>
<script type="text/javascript">
    export default({
        props:['data','column'],
        data: function () {
            return{
                show:'',
                curY: 0,
                lastY: 0,
                deltaY: 0,
                posY: 0,
            }
        },
        computed: {
            pos: function(){
                return '-webkit-transform: translate3d(0,'+this.posY+'px,0);'
            }
        },
        methods:{
            visible: function(e){
                var self = this
                var isMe = false
                var juedgeMe = function(el){
                    if((el != document.querySelector('.pop-up-box') && el != document.querySelector('.pop-menu-box'))){
                        if(el.parentNode)
                           juedgeMe(el.parentNode)
                    }else{
                        isMe = true
                        return
                    }
                }
                juedgeMe(e.target)
                if(e.type == 'click')
                    this.hide()
                if(!!isMe){
                    return
                }
                this.hide()
            },
            hide: function(){
                var self = this
                this.$parent.hide()
                setTimeout(function(){
                    document.removeEventListener('click',self.visible)
                    document.removeEventListener('touchmove',self.visible)
                })
            },
            showpop: function (data) {
                this.show = data
                var self = this
                if(this.show){
                    this.curY = 0
                    this.posY = 0
                    this.deltaY = 0
                    this.lastY = 0
                }
                setTimeout(function(){
                    document.addEventListener('click',self.visible)
                    document.addEventListener('touchmove',self.visible)
                })
            },
            checkPattern: function (data) {
                if(data==1){
                    return 'top-product'
                }else{
                    return ''
                }
            },
            menuTouch: function (e) {
                e.preventDefault()
            },
            touchStart: function(e){
                this.curY = e.touches[0].pageY
                this.lastY = e.touches[0].pageY
            },
            scroll: function(e){
                e.preventDefault()
                this.curY = e.touches[0].pageY
                this.deltaY = this.curY - this.lastY
                this.posY += this.deltaY
                if(this.posY >= 0){
                    this.posY = 0
                }
                var listHeight = document.querySelector('.pop-up-box ul').offsetHeight - document.querySelector('.pop-up-box').offsetHeight + 10
                if(this.posY <= -listHeight){
                    this.posY = -listHeight
                }
                this.lastY = this.curY
            }
        },
    })
</script>
<style lang="less">
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';

    /*图文*/
    .pop-menu-box{
        background-color: @white;
        border-radius: @font-sm/2.5;
        box-shadow: 0 0 (@font-sm/2.5) rgba(0,0,0,0.2);
        padding:0 (@font-sm*1.5);
        position: absolute;
        overflow: hidden;
    &.expand-transition{
         transition:all .2s;
         bottom:@font-sm*5.7;
         max-height: @font-sm*30;
     }
    &.expand-enter{
         bottom:@font-lg-sm*3;
         max-height: 0;
     }
    &.expand-leave{
         bottom:@font-lg-sm*3;
         max-height: 0;
     }
    .pop-menu{
        z-index: @z-mid+10;
    li{
        height: @font-sm*4;
        line-height: @font-sm*4;
        font-size: @font-sm*1.3;
        white-space: nowrap;
        a{
            display: inline-block;
            width:100%;
            i{
                display: inline-block;
                width: @font-lg;
                height: @font-lg;
                vertical-align: middle;
                margin-right: @font-lg-sm/2;
                background-repeat:  no-repeat;
                background-size:contain;
            }
        }
    }
    li:first-child{
        padding-top: 2px;
    }
    li+li{
        border-top: 1px solid #e6e6e6;
    }
    }
    }
    /*图片*/
    .pop-up-box{
        z-index: @z-mid+10;
        margin: 0 @font-sm;
        border:(@font-sm/2) solid #fff;
        border-radius: @font-sm/2;
        box-sizing: border-box;
        position: absolute;
        left:0;
        background-color:@white;
    &.bounce-transition{
         transition:all .2s;
         bottom:@font-sm*5.7;
         max-height:@font-sm*30;
         overflow:hidden;
     }
    &.bounce-enter{
         bottom: @font-lg-sm*3;
         max-height: 0;
         overflow: hidden;
     }
    &.bounce-leave{
         bottom: @font-lg-sm*3;
         max-height: 0;
         overflow: hidden;
     }
    ul{
        width: 100%;
        .grid(2);
    .top-product{
        width: 100%;
    }
    }
    }
</style>