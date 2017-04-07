/**
 * 大小图四图 右大图
 * @Author liuxiaocong
 * @Created-Date: 2016-11-03
 * @Last-Modefied-Date: 2016-11-03
 * @Last-Modefied-By: lxc
 */
<template>
    <ctitle  :data="data"></ctitle>
    <div class="len4-right-big">
        <big-small  :class="[borderStyle(data.borderDisplay), paddingStyle(data.templatePadding)]">
            <a class="react big" :href="data.bigImgList[0].href" slot="right">
                <img v-lazyload="data.bigImgList[0].imageUrl">
            </a>
            <div class="" slot="left">
                <div class="rows">
                    <div class="columns"  v-for="item in data.imgList">
                        <a class="react" :href="item.href">
                            <img v-lazyload:rect="item.imageUrl" >
                        </a>
                    </div>
                </div>
                <div class="rows">
                    <div class="columns" v-for="item in data.smallImgList">
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
    .len4-right-big{
        .bigsmall{
            &.container{
                .right{
                    .flexitem(1);
                    .flexbox();
                    .flexbox.vertical();
                    border-left : @border-nm;
                    .columns{
                        position: relative;
                    }
                }
                .left{
                    .flexitem(1);
                    .flexbox();
                    .flexbox.vertical();
                    border:none!important;
                    .rows{
                        box-sizing: border-box;
                        .grid(2);
                        .flexbox();
                        .columns{
                            .flexitem(1);
                            position: relative;
                        }
                    }
                    .rows:not(:last-child) a{
                        border-bottom : @border-nm; 
                    }
                    .rows:last-child{
                        .columns:first-child:not(:only-child) a{
                            border-right : @border-nm;                            
                            position: absolute;
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
</style>