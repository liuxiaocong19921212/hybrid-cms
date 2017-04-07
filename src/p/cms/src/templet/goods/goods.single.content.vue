<template>
    <em class="name">
        <!-- 商品类型标签 -->
        <tag v-if="data.isBBC == 'N'">
            自营
        </tag>
        <tag :class="{'overseas':data.productType== 'overseas'}" v-if="data.isBBC != 'N' && data.productType== 'overseas'">
            海外购
        </tag>
        <!-- 商品名称 -->
        {{data.name}}
    </em>
    <!--促销语-->
    <div class="sale-prompt" v-if="data.promoWord">
        {{data.promoWord}}
    </div>
    <div class="sale-prompt " v-else>
        &nbsp;
    </div>
    <div class="subtitle">
        <!-- 角标 -->
        <span v-if="triangleTagStyle && triangleSign" class="ui tag solid">{{triangleSign}}</span>
        <!-- 倒计时 -->
        <div class="timer container" v-show="isTimerShow">
            <span class="tip">距结束</span><timer :time-start="data.start" :time-end="data.end"></timer>
        </div>
        <!-- 商品类型特征语 -->
        <p class="info" v-if="data.productType == 'presell'">
            定金{{data.tipInfo}}元
        </p>
        <p class="info" v-if="data.productType == 'exclusive'">
            比pc端省{{data.discountPrice}}元
        </p>
        <p class="info" v-if="data.vipPriceTitle && !data.rebatePriceDesc">
            {{data.vipPriceTitle}}
        </p>
        <p class="info" v-if="data.rebatePriceDesc && data.productType != 'exclusive'">
            {{data.rebatePriceDesc}}
        </p>
        <!-- 
                **因需求变更，仅剩标签暂不显示
                ** author: 刘晓丛
                ** time:2016/10/28 15:15
             -->
        <!-- <p class="info" v-if="data.productType == 'rushbuy' && data.state != 0">
            仅剩<em>{{data.tipInfo}}</em>件
        </p> -->
        <smartbuy :data="data" v-if="data.productType == 'normal'" v-show="data.compare.competitorPrice">
        </smartbuy>
        <!--占位符-->
        &nbsp;
    </div>
    <div class="desc">
        <div class="price">
            <strong :class="{only : !isTagShow, nomoney: data.productType == 'nomoney'}">
                <!--注意-->
                <!--这段是因为防止display inline-block的空格，所以写成了一行-->
                <span v-show="data.price"><span v-if="data.price != '敬请期待' && data.productType !='nomoney'">&yen;</span></span><span v-show="data.price">{{data.price}}</span><span v-show="!data.price">--</span>
            </strong>
            <span v-if="!memPrice" class="vipPrice">{{data.originPrice}}</span>
            <span class="only-piece" v-if="data.productType == 'groupon' && data.state == 1"><em>{{data.tipInfo}}</em>人已参团</span>
            <span class="only-piece" v-if="data.productType == 'rushbuy' && data.state == 1"><em>仅剩<em>{{data.tipInfo}}</em>件</span>
           <!--  
           <tag v-if="data.productType == 'exclusive'" v-show="isTagShow">
                比pc端省{{data.discountPrice}}元
            </tag> 
            -->
        </div>
        <!-- 加入购物车 图标 -->
        <div class="add-cart" 
            :class="{one:showCartFlag == 1}" 
            v-if="cartType == 'icon' && data.productType != 'nomoney'" 
            :is-disabled="(data.state != 1)"
            @click.stop.prevent="onCartBtnClick($event)">
            <button class="add-btn"></button>
        </div>
        <!-- 加入购物车 按钮 -->
        <div class="btn container"  
            :class="{'shop-cart-hide':shopCartHide}" 
            v-if="cartType == 'btn'" 
            @click.stop.prevent="onCartBtnClick($event)">
            <btn class="default block" 
                :class="{three:showCartFlag == 3}" 
                :is-disabled="(data.state != 1)">{{data.productState}}
            </btn>
        </div>
    </div>
</template>
<script>
    import Transformer from '../../utils/dataTransformer.js'
    import comps from 'components'
    /**
     * 购物车按钮base逻辑
     */
    import cartBase from './cart.mixin.vue'
    import smartbuy from './goods.smartbuy.vue'
    export default ({
        mixins: [cartBase],
        props:['data','compare','showCartFlag','showButtonFlag','triangleTagStyle'],
        components:{
            'btn': comps.Button,
            'timer': comps.Timer.Under3,
            'tag': comps.Tag.Default,
            'tagSolid':comps.Tag.Solid,
            'smartbuy': smartbuy
        },
        data: function(){
            return {
                isDisabled: false,
                isTimerShow: false,
                isTagShow: false,
                triangleSign:'',
                shopCartHide:false,
                memPrice:false
            }
        },
        events: {
            timerEnd: function(){
                this.data.state = 3;
                this.isTimerShow = false;
            }
        },
        created: function(){
            if(this.data.vipPriceTitle){
                if(this.data.price.length>8){
                    this.shopCartHide = true;
                };
                this.memPrice = false;
            }else{
                this.memPrice = true;
            };
            if(this.data.productType == 'nomoney'){
                this.shopCartHide = true;
            }
            if(Number(this.data.discountPrice) != 0){
                this.isTagShow = true;
            }
            //shortWord 动态的=。= 短描述
            //promoWord 手动配置的=。= 促销语
            //timer初始显示判断
            if(this.data.state == 1 && !!this.data.end && this.data.start < this.data.end){
                this.isTimerShow = true
            }
            /*
             * 返利
             * 优先展示配置内容
             */
            if(this.data.rebatePriceDesc){
                this.triangleSign = this.data.tagContent;
            }
            //优先显示角标配置内容
            if(this.data.shortWord){
               this.triangleSign = this.data.shortWord;
            }
            //如果是专享，只展示商品类型
            if( this.data.productType == 'exclusive' ||
                (   this.data.productType != 'normal' 
                    && this.data.productType != 'overseas' 
                    && !this.data.shortWord)){
            //除了普通和海外购商品
            //如果没有短描述
            //展示商品类型
               this.triangleSign = this.data.tagContent;
            }
            /*
             * 团抢更改按钮文案
             */
            if(this.data.productType == 'rushbuy' || this.data.productType == 'groupon'){
                /*
                 * 结束事件
                 */
                this.$watch('data.end',function(val){
                    var timeLeft = new Date(val)
                    var delta =  timeLeft.getTime() - serverCurTime
                    if(delta>0 && this.data.state == 1){
                        this.isTimerShow = true
                    }else{
                        this.isTimerShow = false
                    }
                })
            }
        },
    })
</script>
<style lang='less'>
    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import 'goods.less';
    @name-height: 2 * @name-line-height;
    @btn-height: 0.48rem;
    @info-height: 0.55rem;
    @tag-ling-height: .27rem;
    @tag-padding: .02rem;
    .list.col1 .product{
        .content {
            .name {
                .set-line-height(2, @name-line-height + 0.02);
                .set-ellipsis-line(2);
                line-height: .376rem;
                font-size: @font-nm-sm + 0.02;
                .tag{
                    border-radius: .05rem;
                    padding: 0 @tag-padding;
                    font-size: @font-sm;
                    line-height: @tag-ling-height;
                    margin-top: .06rem;
                    &.overseas{
                        color: #bd42dc;
                        border-color: #bd42dc;
                    }
                }
            }
            .sale-prompt{
                margin-top: .08rem;
                .set-ellipsis-line(1);
                font-size: @font-nm-sm;
                color: @red;
                line-height: .332rem;
                height: .332rem;
            }
            @subtitle-font-size: ((@font-nm-sm) - (0.02rem));
            .subtitle {
                height: .37rem;
                .flexbox.v_center();
                margin-top: .15rem;
                font-size: @subtitle-font-size;
                .tag{
                    &.solid{
                        padding: .04rem;
                    }
                }
                .timer {
                    &.container {
                        display: inline-block;
                        color: #a2a4a6;
                        font-size: @font-nm-sm;
                        .timer {
                            i {
                                display: inline-block;
                                padding: .02rem;
                            }
                            span {
                                &.time {
                                    border-radius: .02rem;
                                    padding: .02rem;
                                    display: inline-block;
                                    text-align: center;
                                    .set-line-height(1;.26rem);
                                    &.day {
                                        width: @font-nm-sm * 1.1;
                                        background: initial;
                                        color: inherit;
                                    }
                                }

                            }
                        }
                    }
                }
                .info {
                    font-size: @font-nm-sm;
                    .set-line-height(1;@tag-ling-height + 2 * @tag-padding);
                    color: #a2a4a6;
                    display: inline-block;
                    vertical-align: bottom;
                    line-height: .35rem;
                }
            }
            .desc {
                height: .8rem;
                position: relative;
                margin-top: -0.1rem;
                width: 100%;
                .flexbox();
                .flexbox.v_center();
                .price {
                    .vipPrice{
                        font-size: @font-nm - .02rem;
                        color: #a2a4a6;
                        text-decoration:line-through;
                    }
                    .flexitem(1);
                    strong {
                        display: block;
                        font-weight: bold;
                        font-size: @font-lg-sm + .02rem;
                        color: @red;
                        &.nomoney {
                            font-size: @font-lg-sm - .02rem;
                        }
                    }
                    .tag {
                        margin: .15rem 0 .02rem 0;
                        font-size: @font-sm;
                        .set-line-height(1;@font-nm);
                        padding: 0 .02rem;
                        border-radius: 2px;
                    }
                    span.only-piece{
                        color: #a2a4a6;
                        font-size: .2rem;
                        display: block;
                        margin-top: .05rem;
                        float: left;
                    }
                }
                .btn {
                    &.container {
                        .flexitem(1);
                        height: @info-height;
                        display: -webkit-box;
                        -webkit-box-pack: end;
                        .btn{
                            position: absolute;
                            top: .15rem;
                            right: 0;
                        }
                    }
                    &.disabled {
                        background-color: @red;
                        opacity: .3;
                        color: @white;
                    }
                    &.three{
                        background: inherit;
                        border: 1px solid @red;
                        color: @red;

                    }
                    border-radius: .45rem;
                    width: 1.16rem;
                    text-align: center;
                    font-size: @font-nm - .02;
                    padding: 0;
                    .set-line-height(1;.44rem);
                }
                @media screen and (max-width: 340px) {
                    .add-cart{
                        display: none;
                    }
                    .shop-cart-hide{
                        display: none !important;
                    }
                }
                .add-cart {
                    width: @btn-height + 0.2;
                    height: @btn-height + 0.2;
                    position: absolute;
                    right: 0;
                    top: 0;
                    &.one{
                        .add-btn{
                            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAA9lBMVEUAAADm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ub/////XFzm5ub9/f3q6ur4+Pj7+/vw8PD/ZGTv7+/09PT/kJD/YWH6+vr/5ub/Zmb/7u7/5+fy8vLs7Oz/+fn/xMT/aWn/29v/dHT/bW3/8vL/sLD/4eH/09P/y8v/nZ3/iYn/e3v/trb/srL/q6v/l5f/hYX/fn7/vLwMxUlJAAAAKXRSTlMA+ezMKVT+8bGfMyR5B/Pft6SMViIKjYXk0MGPgGBePLi2BvSYQkFwU2gMGKAAAAMTSURBVFjDtZhpU9swEIZth1yEkHDfZwutdn3EdpzEuUPDWQr0//+ZakLLIl+RSni/aTTzeHcl7yEtXUvH66W93VXE1d290vrxkqaqrY01AyMy1ja2FBDLZf59tDzfbjkmY6bTsn3PQm5TeVkScbmPiH3fYRE5fp9v7F9KIJbq3IYGEUROg9tTnxed6o6OVo9lqGehvlPNYmzmEBsmy5TZQMxtpjPyRbRsNle2hcV8GmOlgJ7JJGR6WFhJZmxzV5ikuEvbKQybSctG3EnwBbHFmBLlW5TxvUB2yFIK+cjZFike8nEpCid9nkOPsfEIRs/TUJriYe5cIx2ixc/2DoArmMpCTAsPiVHReUBmlsz0JB8WvfIGOePOvCocvnDKT3mH6v8YJ9wZspE75f6Qd+jkzZDe+40HBVN6ePY3j80MIQ0B7hVi+5rrypErEgKMFC7L11lO/oKOSAcIpCEOGlUO2cA+EwWpurp/jN7FPuY5ZA39+RBScCcenY9lDjHQUYFwc8aiP7s8u6PF4hCWqEF3+Mw3O232ThZWtGP0JCCk2w7Agync2iNtHX0lCLt2AW6FoGxrJbTVIOwXQFP4C0taDluKkDaPLSO1MKfV0FGEmOK+gzV+wqYKJL5voqHpH4foC4Esxh31wLJYYOmIlSF0xHTZlCF02ZKufQAwyGAMAFzx2if9gBOAdgZkDDARf8CkVNAEeMz+d57EVEBJSUj3o/TKE3YAboWklJgeB1cAL2mU8IF7Y0bSIyVq0g1wW6bXg3hMr6cjgGAcS9RUMki/IUvDWMmg4iXYMklFTG7ixYvKqGj48D5IyvTNoZlYRrVTKuikbgcoscfWVNBPhdYifllcF6BJawgCWsdaC62eEBUXgjAMwKU1tNscHCnnp0K7JQHpdglC7ZbQ+Km7Q40ftaCi2hTI2Jpa0OqcZrjbdN1mN7aON8Ok/ALacvUBoYWYMPIcqI4qBxqJKGpD08HnjG8fHyRJFdmRtvK5w/XHx3zSRfaDw8X/PH1wKT99qD/CZEfniD8H1QxdN2r8OegoIxJ/AOS6UjvmaQgvAAAAAElFTkSuQmCC);
                        }
                    }
                    .add-btn {
                        width: 100%;
                        height: 100%;
                        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAmVBMVEUAAAD/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/XFz/////9vb/dnb/+fn/y8v/bGz/lpb/7+//qqr/YmL/6Oj/39//1NT/iYn/f3//vr7/o6P/sbGpuvtbAAAAIHRSTlMAVY358M236ygk9LGeXzN5B9+kCoUi5NHBgDwGmEJBcCHWojoAAAI7SURBVFjDvZhrd+IgEIYxFzUmWu+t7bY7L5CLd7v//8dt656WFUgMSU6fb8RzngM4DDOwcoZjL35cj4hG68fYGw+ZK4vefEAag3lv4aCYJCOyMkomNRVvT1TB01sNxbBPd+jf253p0qe7+MtplWMVUi3CVbmjF1BNgl6Z44EceLA7PHLCa+FQLFusRfHb2FNqgLa7q6CJJLj5p18+4+NcgB+3mYslfGGKDX1wwSdy62LZKEd0jfUTx5XUQeJH35LvM5flBwDvDpb+l+OZ/uMCcJd9edYncuXQaCoTuiEHjuTAv1yX0A0ZULhIfl1zsp5PAekUcVNbwKOUQsWiFvxzQ1KFvBia5EMycJIAxZluWTM2JIuErOxEfgTAhfY9YuP6kq+zcdC+jZnnJiEhgVxPlLGjhP4YRzRmoatEGMEYspmrxPx9xgbtJQPmt5f4nUg6WU43Gxu2l4Qsbi+JLWEvgV2FYwdwPezNA7gHRIXkDOz1A2imghTYOp2dyJKUcqDISh0Z10/x2pYedwVwyMocB2M1ibUyOQHgW7GzpLYtB+TZTNQLswR/RxW55cpgiSUJ7lHG/mS7vNiELORHCZMizUuuUdYnE8GhErs5VvRVaWELFimB1BybpUXpVDhklklwNYYQADcnosotZ4lZbrFN0+VstBK0ycaG0+piWKScp8I2VgRRJ2V5+wbhoVGr0n3D43XbvrVvJE2iui1t1G1z3X2br3itfnB4/amnj/aPMOZz0Czw/WB25znoL7Q0xXS1fkMsAAAAAElFTkSuQmCC);
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }

</style>
