<template>
    <div class="common-tab">
        <div class='blocker' :style="fixBlocker"></div>
        <tab-nav-img v-ref:tab
            :list="data.commonTabTagBeanList"
            :options="optionsTab"
            :templete-state-color="stateColor"
            :style="fix">
        </tab-nav-img>
    </div>
</template>

<script>
import comps from 'components'
import transformer from '../../utils/dataTransformer.js'
export default (
    Vue.extend({
        components: {
            'tab-nav-img': comps.TabNavImg,
        },
        data: function(){
            return {
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
                    'perSliders': 'auto',
                    'wrapperWidth': document.body.offsetWidth
                },
                fixBlocker: {
                    'height': 0
                },
                fix: {
                    'position': 'absolute',
                    'top': 0,
                    'z-index': 9999,
                    '-webkit-transform': 'translateZ(0)',
                    '-moz-transform': 'translateZ(0)',
                    'transform': 'translateZ(0)',
                },
                stateColor:{
                    templateBgColor:'#fff',
                    defaultFontColor:'#333',
                    selectBgColor:'#fdeaea',
                    selectFontColor:'#333'
                }
            }
        },
        created: function(){
            transformer.templetScrollPosition(this.data.commonTabTagBeanList);
            /*
             * stateColor 模板状态颜色（手指按下[active]更改相关配置颜色）
             * 模板 and 文字  颜色支持后台配置
             * templateBgColor   模板背景颜色
             * selectBgColor     选中背景颜色
             * defaultFontColor  默认文字颜色
             * selectFontColor   选中文字颜色
             */
            this.stateColor.templateBgColor = this.data.templateBgColor;
            this.stateColor.defaultFontColor = this.data.defaultFontColor;
            this.stateColor.selectBgColor = this.data.selectBgColor;
            this.stateColor.selectFontColor = this.data.selectFontColor;
        },
        ready: function(){
            var _scope = this;
            window.addEventListener('scroll',function(){
                /*
                 * $blocker   吸顶
                 * rect       距离顶部距离
                 * tabTemplet 公用tab标签模板
                 * tabNav     含有带标签的模板
                 * thisTab    指当前tab标签模板吸顶的内容
                 */
                var $blocker = _scope.$el.querySelector('.blocker'),
                    rect = $blocker.getBoundingClientRect(),
                    tabTemplet = document.querySelectorAll('.tab-nav-img-container'),
                    tabNav = document.querySelectorAll('.tab-nav-container'),
                    thisTab = _scope.$refs.tab.$el;
                if(rect.top < 0){
                    thisTab.style.position = 'fixed';
                    /*
                     * 遍历页面内定位页面顶部的模板内容，并按照模板先后顺序展示
                     */
                    for(var j = 0;j<tabTemplet.length;j++){
                        /*
                         * tabRect 公用tab标签距离页面顶部位置
                         * eleRect 含有带标签的模板 距离页面顶部位置
                         */
                        var tabRect = tabTemplet[j].previousSibling.previousSibling.getBoundingClientRect().top;
                        if(tabRect<thisTab.offsetHeight){
                            /*
                             * tabPositionCounter 页面内tab标签吸顶元素计数
                             */
                            var tabPositionCounter = 0;
                            for(var tabLen=0;tabLen<tabTemplet.length;tabLen++){
                                if(tabTemplet[tabLen].style.position == 'fixed'){
                                    tabPositionCounter++
                                };
                            }
                            if(tabPositionCounter>1){
                                for(var t =0;t<tabTemplet.length;t++){
                                    tabTemplet[t].style.position= 'inherit';
                                }
                            }
                        }else{
                            thisTab.style.position = 'fixed'
                        }
                        /*
                         * 含有带标签单双列商品模板时
                         */
                        if(tabNav){
                            for(var i = 0;i<tabNav.length;i++){
                                if(tabNav[i].previousSibling.previousSibling.previousSibling.className == 'blocker'){
                                    var eleRect = tabNav[i].previousSibling.previousSibling.previousSibling.getBoundingClientRect().top;
                                    if(eleRect< thisTab.offsetHeight){
                                        thisTab.style.position = 'inherit'
                                    }else{
                                        thisTab.style.position = 'fixed'
                                    }
                                }
                            }
                        }
                    }
                }else if(rect.top >= 0){
                    thisTab.style.position = 'inherit'
                }
            })
        }
    })
)
</script>

<style lang='less'>
    @import '../../../../../b/components/src/core/less/layout.less';
    .common-tab{
        overflow: hidden;
        position: relative;
    }
</style>
