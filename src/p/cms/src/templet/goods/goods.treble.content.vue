/**
 * 商品内容模板
 * @Author zhaoye
 * @Created-Date: 2016
 * @Last-Modefied-Date: 2016-11-17
 * @Last-Modefied-By: zhaoye
 */
 <template>
     <!--商品名称-->
     <em v-else class="name">
         {{data.name}}
     </em>
     <!--促销语-->
     <div class="promotion">
         <!--抢购-->
         <p v-if="data.state == 1 && data.productType == 'rushbuy'">仅剩{{data.tipInfo}}件</p>
         <!--团购-->
         <p v-if="data.state == 1 && data.productType == 'groupon'">{{data.tipInfo}}人参团</p>
         <!--预售-->
         <p v-if="data.productType == 'presell'"></p>
         <!--掌上专享-->
         <p v-if="data.productType == 'exclusive' && data.discountPrice">比pc端省{{data.discountPrice}}元</p>
         <p v-if="data.rebatePriceDesc && data.productType != 'exclusive'">{{data.rebatePriceDesc}}</p>
     </div>
     <!--价格区域-->
    <div class="desc">
        <div class="price">
            <!--价格-->
            <strong >
                <span v-show="data.price"><span v-if="data.price != '敬请期待'">&yen;</span></span><span v-show="data.price">{{data.price}}</span><span v-show="!data.price">--</span><span v-if="data.productType == 'exclusive'" class="product-tel-icon"></span><span v-if="data.productType != 'exclusive' && data.rebatePriceDesc" class="rebate-icon">返</span>
            </strong>
        </div>
        <!--按钮-->
        <div
            class="btn-box"
            v-if="showCartFlag == 4" 
            @click.stop.prevent="onCartBtnClick($event)">
            <btn class="default beginSoonBtn" v-if="data.state == 0">{{data.productState}}</btn>
            <btn class="default" v-if="data.state == 1">{{data.productState}}</btn>
            <btn class="default grayBtn" v-if="data.state > 1">{{data.productState}}</btn>
        </div>
    </div>
</template>
<script>
    import comps from 'components' 
    /**
     * 购物车按钮base逻辑
     */
    import cartBase from './cart.mixin.vue'
    export default ({
        mixins: [cartBase],
        props:['data','showCartFlag','item','showButtonFlag'],
        components:{
            'tag': comps.Tag.Solid,
            'btn':comps.Button,
        },
    })
</script>
<style lang='less'>
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
@import '../../../../../b/components/src/product/style/product.less';
@import 'goods.less';

@name-height: @font-nm-sm + .06rem;
.list {
    &.col3 {
        .product {
            .container {
                &.content {
                    .name {
                        color: @gray-dark;
                        font-size: @font-nm-sm;
                        .set-ellipsis-line(2);
                        height: .24rem;
                        line-height: .25rem;
                        margin-bottom: .07rem;
                    }
                    .promotion {
                        font-size: @font-sm;
                        color:#a2a4a6;
                        margin: @font-sm*0.6 0 0;
                        min-height: @font-sm*1.5;
                        line-height: @font-sm*1.5;
                        p {
                            line-height: @font-sm*1.5;
                            overflow: hidden;
                            height: .3rem;
                        }
                    }
                    .desc {
                        margin-bottom: .11rem;
                        .price {
                            .tip {
                                .tag {
                                    &:not(:last-child){
                                        margin-right: .1rem;
                                    }
                                    &.overseas {
                                        background-color: #8c2d99;
                                        border-color: #8c2d99;
                                    }
                                }
                            }
                            strong {
                                display: block;
                                color: @red;
                                font-size: @font-lg-sm;
                                font-weight: bolder;
                                .set-line-height(1,.3rem + .1rem);
                                &.disable {
                                    color: @gray;
                                }
                                .product-tel-icon {
                                    display:inline-block;
                                    width: 0.28rem;
                                    height: 0.28rem;
                                    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMmVkMzJlNC04NDM5LTQ2YjEtYWNlYS1hYzQyOTE2MzQwMTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0JERDZGNDlBN0RGMTFFNjhCQUY4OUNGOEJDNjQ0M0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0JERDZGNDhBN0RGMTFFNjhCQUY4OUNGOEJDNjQ0M0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkOGE1MmRiMy05NTFmLTQxNDYtYWNiMC0wZWU3Yjg1YzhmNjgiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxMzM4NDIzYS0zMDg5LTExNzktYjk0Zi05ODc5YzZiNGExNWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5td61tAAAA6UlEQVR42mJ8b2DgycDAMBeIJRloC54DcTIj0MJndLAMbikTHS0DAUkWXDKs1tYMnA0NDEwiIiSZ+O/NG4bvQH2/jx7FKg8K0v/YJPh27ybZMmRLP7m6YpVjwqWJXMsI6WUhpPmDoSFJlgmcP4/fMQx0BqMWjlo4auGohcPQQoKFN6HCeHgG6Y8pUxg+AlsEIJo+Fi5axPD/2zeGn8uXU89CUDMBF+CIi2Ng5ORkYI+MxK737VucenG2aVhtbCCNKGFh0tozr14xfG9uZvh95AhpFtIy0Tyno30vQBamgBh0sOwpqKkPEGAAJYND29ryNQ8AAAAASUVORK5CYII=") no-repeat;
                                    background-size: contain;
                                    border-radius: .05rem;
                                    margin-left: (@font-sm/2);
                                }
                                .rebate-icon{
                                    display: inline-block;
                                    background: #ff5c5c;
                                    color: #fff;
                                    padding: .02rem .03rem;
                                    /* height: .28rem; */
                                    line-height: .24rem;
                                    font-size: .24rem;
                                    border-radius: .02rem;
                                    margin-left: .1rem;
                                    padding-bottom: .03rem;
                                    margin-top: .06rem;
                                    vertical-align: top;
                                }
                            }
                            @media screen and (max-width: 340px) {
                                strong{
                                    font-size: @font-lg-sm - .02rem;
                                }
                            }
                            .tip {
                                //.set-line-height(1,@font-sm + .1rem);
                                margin-bottom: .1rem;
                                del{
                                    font-size: @font-sm;
                                    color: @gray-light;
                                }
                            }
                        }
                        .btn-box {
                            margin: @font-sm*0.8 @font-sm*0.2 @font-sm*0.7 @font-sm*0.2;
                            .ui {
                                &.btn {
                                    &.default {
                                        font-size: @font-sm*1.3;
                                        line-height: @font-sm*2.6;
                                        width: 100%;
                                        text-align: center;
                                        border-radius: .45rem;
                                    }
                                    &.grayBtn {
                                         background-color: @gray-dark-border;
                                         color: @gray-lighter;
                                    }
                                    &.beginSoonBtn {
                                        opacity: 0.3;
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
    }
}
</style>
