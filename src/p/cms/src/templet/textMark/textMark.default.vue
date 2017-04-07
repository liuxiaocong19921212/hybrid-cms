<template>
    <title v-if="data.displayName">{{data.displayName}}</title>
    <div class="customtext wrapper" :class="{'fold': isOverflow}">
        <div class="customtext item" :class="[item.fontSize,item.fontColor]" v-for="item in data">
            <i v-if="item.icoUrl" class="icon" :style="'background-image:url('+item.icoUrl+')'">&nbsp;</i>
            <i v-else class='dot'>&nbsp;</i>
            <div class="text">
                <span class="content">{{item.text}}</span><!--防止inline-block--><a :href="item.href" v-if="item.linkText">{{item.linkText}}<i class="icon-font">&nbsp;&#x00a5;</i></a>
            </div>
        </div>
    </div>
    <div class="customtext trigger container" v-show="isAlwaysShow"  @click="openOrFold">
        <i class="customtext trigger icon" :class = "{ 'reverse' : !isOverflow }" data-icon="&#x005f;" ></i>
    </div>
</template>
<script>
    import Transformer from '../../utils/dataTransformer.js'
    import comps from 'components'
    import title from '../title/title.vue'
    export default ({
        components: {
            'comps': title,
        },
        data: function(){
            return {
                isOverflow: true,
                isAlwaysShow: false
            }
        },
        compiled: function(){
            this.judgeBigItem()
            this.judgeOverflow()
            this.judgeEllipsis()
        },
        methods: {
            judgeBigItem: function(){
                var list = this.$el.querySelectorAll('.item')
                var maxHeight = Number(window.getComputedStyle(this.$el.querySelector('.customtext.wrapper')).maxHeight.replace('px',''))
                for(var i=0; i<list.length; i++){
                    if(list[i].querySelector('.content').offsetHeight < maxHeight/2 && list[i].classList.contains('big') ){
                        //do nothing
                    }else if(list[i].classList.contains('big')){
                        list[i].classList.remove('big')
                    }
                }
            },
            judgeOverflow: function(){
                var containerHeight = this.$el.offsetHeight
                var realHeight = 0;
                var list = this.$el.children[0].children
                for(var i=0; i<list.length; i++){
                    realHeight += list[i].offsetHeight
                }
                this.isOverflow = realHeight > containerHeight ?  true : false
                this.isAlwaysShow = this.isOverflow
            },
            judgeEllipsis: function(){
                var maxHeight = Number(window.getComputedStyle(this.$el.querySelector('.customtext.wrapper')).maxHeight.replace('px',''))
                if(this.$el.querySelectorAll('.content').length > 0)
                    var fstItem = this.$el.querySelectorAll('.content')[0]
                if(this.$el.querySelectorAll('.content').length > 1)
                    var secItem = this.$el.querySelectorAll('.content')[1]
                //3种情况
                //1. 第一个文本的行数超过3
                if(fstItem){
                    if(fstItem.offsetHeight >= maxHeight){
                        fstItem.classList.add('ellipsis-line3')
                    }
                }
                if(fstItem && secItem){
                    //2. 第一个文本一行，第二个文本的行数超过2
                    if(fstItem.offsetHeight < maxHeight/2 && secItem.offsetHeight > maxHeight/2){
                        //即1行
                        secItem.classList.add('ellipsis-line2')
                    }
                    //3. 第一个文本两行，第二个文本的行数超过1
                    if(fstItem.offsetHeight > maxHeight/2){
                        secItem.classList.add('ellipsis-line1')
                    }
                }
            },
            openOrFold: function(e){
                this.isOverflow  =  this.isOverflow  ? false : true
            }
        }
    })
</script>
<style lang="less">
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
    @dot-size: .08rem;
    @icon-size: .26rem;
    @line-height-lg: .48rem;
    @line-height-nm: .44rem;
    @link-color: #0a72ff;
    @content-color: #ff7e00;
    @line-edge: ((@line-height-nm)-(@font-nm-sm))/2;
    .content(){
    }
    .customtext {
        &.orange, {
            color: @content-color;
        }
        &.gray, {
            color: @gray;
        }
        &.black, {
            color: @gray-dark;
        }
        &.wrapper{
            position:relative;
            padding-top: .1rem;
            box-sizing: content-box;
            background-color: @white;
            &.fold {
                max-height: (3 * (@line-height-nm) );
                overflow: hidden;
                .item {
                    .content {
                        &.ellipsis-line1 {
                            .ellipsis-line(1);
                            margin-bottom: @line-edge;
                            margin-right: 0;
                        }
                        &.ellipsis-line2 {
                            .ellipsis-line(2);
                            margin-bottom: @line-edge;
                            margin-right: 0;
                        }
                        &.ellipsis-line3 {
                            .ellipsis-line(3);
                            margin-bottom: @line-edge;
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        &.item {
            .flexbox();
            padding: 0 .2rem;
            font-size: @font-nm-sm;
            line-height: @line-height-nm;
            .text {
                .flexitem(1);
                line-height: @line-height-nm;
                .content {
                    word-wrap: break-word;
                    margin-right: .4rem;
                }
                a {
                    display: inline-block;
                }
            }
            i {
                &.dot {
                    display: block;
                    width: @dot-size;
                    height: @dot-size;
                    margin: ((@icon-size) - (@dot-size));
//                    margin-right: ((@icon-size) - (@dot-size) + (.14rem));
                    border-radius: @dot-size;
                    background-color: @gray-dark;
                }
                &.icon {
                    background-repeat: no-repeat;
                    background-size: contain;
                    margin: @line-edge;
                    width: @font-nm-sm;
                    height: @font-nm-sm;
                }
                &.icon-font {
                    font-size: @font-nm/2;
                    font-weight: bold;
                    line-height: 1;
                    -wekbit-transform: translateY(-.02rem);
                    transform: translateY(-.02rem);
                }
            }
            a {
                color: @link-color;
                small {
                    font-family: cursive;
                    font-size: @font-sm;
                }
            }
            &.big, {
                font-size: @font-nm;
                line-height: @line-height-lg;
                .text {
                    .flexitem(1);
                    line-height: @line-height-lg;
                    .content {
                        margin-right: .4rem;
                    }
                    a {
                        display: inline-block;
                    }
                }
                i {
                    &.icon {
                        margin: ((@line-height-lg) - (@font-nm-sm))/2;
                    }
                }
            }
        }
        &.trigger {
            &.container {
                padding: .15rem 0 .1rem 0;
                background-color: @white;
            }
            &.icon {
                display: block;
                font-size: .15rem;
                color: @link-color;
                font-weight: bolder;
                &.reverse:before {
                    transform: rotate(180deg);
                    -webkit-transform: rotate(180deg);
                }
            }

        }
    }

</style>
