/**
 * 活动页通用模板组件
 * @Author: zhaoye
 * @Created-Date: 2016-11-03
 * @Last-Modefied-Date: 2016-11-21
 * @Last-Modefied-By: zhaoye
 */
<template>
    <!--标题组件-->
    <h3 class="cms-title2" v-if="isShow"  :style="customStyle">
    <!--背景图-->
        <a   :href="href || 'javascript:;'">
            <img v-if="data.backImgUrl && isShowImg" :src="data.backImgUrl">
        </a>
    <!--主标题-->
        <span class="content" v-if="!data.backImgUrl">
            {{data.displayName.substring(0,10)}}
            <slot></slot>
        </span>
    <!--副标题-->
        <a  class='subcontent' v-if="data.templetPromo && !data.backImgUrl" :href="href || 'javascript:;'" :style="customStyle">
            {{data.templetPromo.substring(0,8)}}<i></i>
        </a>
    </h3>
</template>
<script>
    import Transformer from '../../utils/dataTransformer.js';
    import maimaMixin from '../../utils/maima.mixin.vue';
    export default ({
        /**
         * 埋码方法
         * @type {comp}
         */
        mixins: [maimaMixin],
        /**
         * @param data cms templetList中的源数据
         */
        props:['data', 'mid'],
        data: function(){
            return {
                /**
                 * 后台自定义的样式
                 * @type {style}
                 */
                customStyle: {
                    'backgroundColor': '',
                    'color': ''
                },
                /**
                 * 显隐控制
                 * @type {Boolean}
                 */
                isShow: true,
                isShowImg: true,
                href: ''
            }
        },
        created: function(){
            //标题颜色
            if(this.data.displayColor)
                this.customStyle.color = this.data.displayColor
            if(this.data.displayBackColor)
                this.customStyle.backgroundColor = this.data.displayBackColor

            //背景图开始结束显隐控制
            var start = this.data.backImgStartTime
            var end = this.data.backImgEndTime
            var now = new Date(window.serverCurTime);
            if(start && now < start){
                this.isShowImg = false;
                this.isShow = false;
            }
            if(end && now > end){
                this.isShowImg = false;
                this.isShow = false;
            }
            //标题显隐，无背景且无主标题，副标题时隐藏
            if(!this.data.backImgUrl && !this.data.displayName){
                this.isShow = false
            }
            this.href = Transformer.transHref(this.data)
        }
    })
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';

@height: .86rem;

.cms-title2 {
    .flexbox();
    .flexbox.v_center();
    min-height: @height;
    line-height: @height;
    background-color: @white;
    font-size: @font-nm;
    color: @gray-dark;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    .content {
        .flexitem(1);
        font-size: @font-lg-sm;
        margin-left: .2rem;
    }
    img {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
    }
    .subcontent {
        .flexbox();
        .flexbox.v_center();
        font-size: @font-nm-sm;
        line-height: @font-nm-sm;
        i {
            display: inline-block;
            margin: 0 .2rem 0 .08rem;
            width: @font-nm-sm;
            height:  @font-nm-sm;
            .set-line-height(1; @font-nm-sm;);
            font-size:  @font-nm-sm / 2;
            background-color: @white;
            opacity: .7;
            color: @gray;
            border-radius: 100%;
            background-image: url(../../images/icon.png);
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
    }
    
}
</style>
