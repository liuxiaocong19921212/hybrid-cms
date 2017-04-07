/**
* cms促销页，底部导航
* @Author: zhaoye-ds1
* @Date: 2016-05-30 10:00
* @Last-Modified-Date: 2016-05-30 13:21
* @Last-Modified-By: zhaoye-ds1
*/
<template>
    <nav v-if="datetime(data.startDate,data.endDate)" class="bottom" style="opacity:1;-webkit-transform:translate3d(0,0,1px);" :style="{backgroundImage : 'url(' + data.backImgUrl + ')'}">
        <item
                :fcolor="data.defaultFontColor"
                :fcolor-active="data.selectFontColor"
                :info="pageInfo"
                :data="item"
                :idx="index"
                :sublist="data.bottomSubList"
                v-for="(index,item) in data.bottomColumnList"
                v-if="(!item.pattern)||(item.pattern&&data.bottomSubList)">
        </item>
    </nav>
</template>
<script type="text/javascript">
    import Item from './bottomNavItem.vue'
    export default (
            Vue.extend({
                components: {
                    'item': Item
                },
                created: function(){
                    var style = document.createElement('style')
                    style.innerHTML = '.tip-no-more{margin-bottom:1rem;} div#gotop{bottom: 1rem;}'
                    document.head.appendChild(style)
                },
                methods:{
                    datetime:function(start,end){
                        if(start==undefined&&end==undefined){
                            return true;
                        }else if(start!=undefined){
                            var myDate=new Date().getTime(),
                                    andStart= new Date(start).getTime(),
                                    iosstartDate =start.replace(new RegExp('-','gm'),'/'),
                                    iosStart = new Date(iosstartDate).getTime();
                            if(end!=undefined){
                                var andEnd= new Date(end).getTime(),
                                        iosendDate = end.replace(new RegExp('-','gm'),'/'),
                                        iosEnd = new Date(iosendDate).getTime();
                                if((andStart<=myDate && myDate<=andEnd)||(iosStart<=myDate && myDate<=iosEnd)){
                                    return true
                                }else{
                                    return false
                                }
                            }else{
                                if((andStart<=myDate)||(iosStart<=myDate)){
                                    return true
                                }else{
                                    return false
                                }
                            }
                        }
                    }
                }
            })
    )
</script>
<style lang="less">
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    nav {
    &.bottom {
         height: .94rem;
         border-top: 1px solid @gray-border;
         background-color:#f9f9f9;
         background-size: 100% 100%;
         background-repeat: no-repeat;
         position: fixed;
         bottom: 0;
         width: 100%;
     .flexbox();
         z-index: @z-max*10;
     }
    }
</style>
