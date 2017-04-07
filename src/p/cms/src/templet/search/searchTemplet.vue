<template>
    <section v-show="isShow" class="channel-search">
        <a class="tag-img" href="{{data.url}}">
            <img src="./images/icon-classification.png">
        </a>
        <a class="search-box" href="{{boxUrl}}">
            <img class="search-icon" src="./images/icon-search.png">
            <span class="search-text">{{data.innerWords}}</span>
        </a>
    </section>
</template>

<script>
import Transformer from '../../utils/dataTransformer.js'
import {Config} from 'components'
export default (
    Vue.extend({
        data: function(){
            if(Config.platform.wap){
                return {
                    isShow: true
                }
            }else{
                return {
                    isShow: window.appVersion >= 62 ? true : false,                
                }    
            }
        },
        created: function(){
            this.data.promsUrl = this.data.url
            this.data.url = Transformer.transHref(this.data)
        },
        computed: {
            boxUrl: function(){
                if($g.env.hybrid){
                    return this.data.searchType == 1 ? Transformer.transEnv("http://m.gome.com.cn/search-oversea.html") : "javascript:void(0)"
                }else{
                    return this.data.searchType == 1 ? Transformer.transEnv("http://m.gome.com.cn/goods_class/searchOversea") : "javascript:void(0)"
                }
            }
        }
    })
)
</script>

<style lang='less'>
    @import '../../../../../b/components/src/core/less/layout.less';
    .channel-search {
        height: 1rem;
        background-color: #fff;
        .flexbox();
        .tag-img {
            display: block;
            margin: .33rem .3rem .33rem .24rem;
            width: .4rem;
            height: .34rem;
        }
        .search-box {
            -webkit-flex: 1;
            .flexitem(1);
            margin: .2rem .24rem .2rem 0;
            width: 5.22rem;
            height: .6rem;
            border:1px solid #d2d2d2;
            border-radius: 2px;
            box-sizing: border-box;
        }
        .search-icon {
            float: left;
            width: .3rem;
            height: .3rem;
            margin: .14rem .14rem;
        }
        .search-text {
            line-height: .6rem;
            font-size: .26rem;
            color: #ccc;
        }
    }
</style>
