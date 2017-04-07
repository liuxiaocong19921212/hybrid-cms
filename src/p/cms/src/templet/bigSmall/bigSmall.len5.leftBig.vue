/**
 * 大小图五图 左大图
 * @Author liuxiaocong
 * @Created-Date: 2016-11-03
 * @Last-Modefied-Date: 2016-11-03
 * @Last-Modefied-By: lxc
 */
<template>
    <ctitle  :data="data"></ctitle>
    <div class="len5-left-big">
        <big-small  :class="[borderStyle(data.borderDisplay), paddingStyle(data.templatePadding)]">
            <a class="react big" :href="data.bigImgList[0].href" slot="left">
                <img v-lazyload="data.bigImgList[0].imageUrl">
            </a>
            <div class="" slot="right">
                <div class="rows">
                    <div class="columns" v-for="item in data.smallImgList">
                        <a class="react" :href="item.href">
                            <img v-lazyload:rect="item.imageUrl" >
                        </a>
                    </div>
                </div>
                <div class="rows">
                    <div class="columns" v-for="item in data.imgList">
                        <a class="react" :href="item.href">
                            <img v-lazyload:rect="item.imageUrl" >
                        </a>
                    </div>
                </div>
            </div>
        </big-small>
    </div>
</template>
<script>

import comps from 'components'
import ctitle from '../title/ctitle.vue'
import styleMixin from '../../utils/style.mixin.vue';
export default(
    Vue.extend({
        mixins: [styleMixin],
        components: {
            'big-small': comps.BigSmall,
            'ctitle': ctitle
        }
    })
)
</script>
<style lang="less">
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    .len5-left-big{
        .bigsmall{
            &.container{
                .left{
                    width: 40%;
                    .flexitem(2);
                    .flexbox();
                    .flexbox.vertical();
                    border-right : @border-nm;
                    .columns{
                        position: relative;
                    }
                }
                .right{
                    width: 60%;
                    .flexitem(3);
                    .flexbox();
                    .flexbox.vertical();
                    .rows{
                        .grid(2);
                        .flexbox();
                        .columns{
                            .flexitem(1);
                            position: relative;
                        }
                        &:not(:only-child):not(:last-child){
                            a{
                                border-bottom : @border-nm;
                            }
                        }  
                        .columns:first-child:not(:only-child){
                            a{
                                border-right : @border-nm;
                                /*部分手机浏览器 和 webview 图片高度100% 会被拉伸*/
                                position: absolute;
                                top: 0;
                                bottom: 0;
                                height: 100%;
                                width: 100%;
                                overflow: hidden;
                                bottom: 0;
                                img{
                                    position: absolute;
                                    bottom: 0;
                                    top: 0;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>