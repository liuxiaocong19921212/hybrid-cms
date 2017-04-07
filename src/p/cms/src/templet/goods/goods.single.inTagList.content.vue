<template>
    <em class="name" :data="data">
        <tag-default v-if="data.isBBC == 'N'">自营</tag-default><span :class="{ 'disabled' : data.state==3 && data.productState}">{{data.name}}</span>
    </em>
    <div class="subtitle">
        <div class="timer container" v-show="isTimerShow">
            <span class="tip">距结束</span>
            <timer :time-start="data.start" :time-end="data.end"></timer>
        </div>
        <p class="info" v-if="data.productType == 'groupon' && data.state != 0">
            <em>{{data.tipInfo}}</em>人已参团
        </p>
        <!-- 
                **因需求变更，仅剩标签暂不显示
                ** author: 刘晓丛
                ** time:2016/10/28 15:15
             -->
       <!--  <p class="info" v-if="data.productType == 'rushbuy' && data.state != 0">
            仅剩<em>{{data.tipInfo}}</em>件
        </p> -->
    </div>
    <div class="desc">
        <div class="price">
            <tag v-if="data.productType == 'groupon'">团购</tag>
            <tag v-if="data.productType == 'rushbuy'">抢购</tag>
            <strong>
                <span v-show="data.price"><span v-if="data.price != '敬请期待'">&yen;</span></span><span v-show="data.price">{{data.price}}</span><span v-show="!data.price">--</span>
            </strong>
        </div>
        <div v-show="showCartFlag == 1" class="add-cart" @click.stop.prevent="isLogin" v-if="data.productType == 'normal'||data.productType == 'exclusive'">
            <button class="add-btn"></button>
        </div>
    </div>
</template>
<script type="text/javascript">
    import Transformer from '../../utils/dataTransformer.js'
    import comps from 'components'
    import base from './goods.single.content.vue'
    export default ({
        props: ['showCartFlag'],
        'mixins': [base],
        components: {
            'tag': comps.Tag.Solid,
            'tagDefault': comps.Tag.Default,
        },
        data: function() {
            return {
                isTagShow: true
            }
        },
        methods: {
            isLogin: function() {
                //判断登录
                var _this=this;
                navigator.gome.util.nativeUtils.isLogin(function(data) {
                    data = typeof data == 'string' ? JSON.parse(data) : data;
                    if (data.isLogin == 'Y') {
                        _this.addCart();
                    }else {
                        navigator.gome.app.nativeLogin.jumpToNativeLogin();
                    }
                });
            },
            addCart: function() {
                var self = this;
                if (navigator.gome.util.nativeUtils.getAddressFourArea) {
                    navigator.gome.util.nativeUtils.getAddressFourArea(function(data) {
                        data = typeof data == 'string' ? JSON.parse(data) : data;
                        for (var key in data) {
                            data[key] = typeof data[key] == 'string' ? JSON.parse(data[key]) : data[key];
                        }
                        var addrCode = data.province.code + data.city.code + data.district.code + data.town.code;
                        navigator.gome.util.nativeRequest.sendNativeRequest(
                            function(data) {
                                data = typeof data == 'string' ? JSON.parse(data) : data;
                                if (data.isSuccess == 'Y') {
                                    navigator.gome.util.nativeUtils.showToast("添加购物车成功");
                                } else {
                                    navigator.gome.util.nativeUtils.showToast(data.failReason);
                                }
                            },
                            function(data) {
                                data = typeof data == 'string' ? JSON.parse(data) : data;
                                navigator.gome.util.nativeUtils.showToast(data.failReason || '请求失败');
                            }, {
                                "url": ( !$g.env.hybrid && location.host.match(/plus\.com/) ) ? Transformer.transEnv('http://mobile.gomeplus.com/mobile/order/cart/cartAdd.jsp') : Transformer.transEnv('http://mobile.gome.com.cn/mobile/order/cart/cartAdd.jsp'),
                                "type": "POST",
                                "param": {
                                    "skuID": self.data.skuId,
                                    "goodsNo": self.data.goodsNo,
                                    "number": "1",
                                    "goodsType": self.data.goodsType,
                                    "districtCode": addrCode,
                                },
                                "isNeedLoading": "N"
                            })
                    });
                }

            }
        }
    })
</script>
<style lang="less">
    /*@import '../../../../../b/components/src/core/less/utils.less';
    @import '../../../../../b/components/src/core/less/var.less';
    @title-font-size: @font-nm - 0.02rem;
    @img-height: 2.24rem;
    @img-padding: 0.1rem;
    @btn-height: 0.48rem;
    .tagGoodsList {
        &.single {
            .list {
                &.col1 {
                    .product {
                        padding: 0;
                        a {
                            &.react {
                                .img.container {
                                    margin: @img-padding;
                                    img {
                                        width: @img-height;
                                        height: @img-height;
                                    }
                                }
                            }
                        }
                        .content {
                            &.container {
                                height: @img-height + 2*@img-padding;
                                padding: .24rem .2rem .22rem;
                                .name {
                                    margin-bottom: .12rem;
                                    font-size: @title-font-size;
                                    .set-line-height(2;
                                    @title-font-size+.08rem);
                                    .disabled {
                                        opacity: .3;
                                    }
                                    .tag {
                                        font-size: @font-sm;
                                        .set-line-height(1;
                                        @font-sm);
                                        padding: .02rem;
                                        margin-right: @title-font-size/2;
                                    }
                                }
                                .subtitle {
                                    font-size: @font-nm-sm;
                                    .set-line-height(1;
                                    .3rem);
                                    .info {
                                        //ugly-fix
                                        margin-top: .02rem;
                                        em {
                                            color: #ff8000;
                                        }
                                    }
                                }
                                .timer {
                                    .time {
                                        background-color: #536079 !important;
                                    }
                                }
                                .desc {
                                    height: auto;
                                    padding-bottom: .22rem;
                                    padding-right: .4rem;
                                    .price {
                                        strong {
                                            font-size: @font-lg;
                                        }
                                        .tag {
                                            margin: 0 0 .15rem 0;
                                        }
                                    }
                                    .add-cart {
                                        position: relative;
                                        width: @btn-height;
                                        padding: .35rem;
                                        .add-btn {
                                            position: absolute;
                                            bottom: 0;
                                            right: 0;
                                            width: @btn-height;
                                            height: @btn-height;
                                            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzM4NUFEMEE2MDM2MTFFNkJDRjlCMTQwN0U3NDc4MTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzM4NUFEMEI2MDM2MTFFNkJDRjlCMTQwN0U3NDc4MTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Mzg1QUQwODYwMzYxMUU2QkNGOUIxNDA3RTc0NzgxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3Mzg1QUQwOTYwMzYxMUU2QkNGOUIxNDA3RTc0NzgxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvWoU0QAAAN0SURBVHja7JrLSitBEIarJ5OL8SQiQTTiDTceFUEExQeIB/EKPoFLs9FHEFQMgvtsxJ2KKD7ASSAbQXwBXYq3RIJydKK5TqZPV2eMLoRoZibJQAqaCWEu/9fd1VU104RSCmixWMzHDn7W8OiG2jSJtTBrQa/XG+b/IEA0Gt2Mx+M0lUpRRVForRpqQ42oFTWjdsJ++ERRDHk8HhAEAcxgDASenp5AluUJVOx3uVymEY+GWlEzakfVPrvdDmYzVfMfBHATQkwHoGr+JYDJrQ5QB9Bo4jcWXVCi0Q/naW4G0thoHgCaTII0O/vZ/cHq84FzYwOIzWaCKcQEE7e72MBigVwoBNnDw9oYApZK/CgfyUYi9N/wME0sLVU9N0LtP3ZicWiIH/OXl+ZchQgmfW1tQF9eQLm7M8Eq9IVZ+vtBeXiA1NYWkNbW0tBWK0BDQ+nzRBHE8XEQR0aMB8hFIpA7PdW/S3d2wLm2BraZGeMAxMHBwvzr6ADH4iLQbBYgndasPc/iTfb4GDL7+8YC4AjwGMH8wLawwJdaXQqV62sOwMouY1MJjMaC1ws0kdDVkfO3t4UOYiNreC5kGRgoPPTiQr9SUe0MoZIAsp4AbApxUd3dxgOIqh/oGdCqMgJ8CrGMVVcf6OoyHoA0NfGeom9voKgP1qY+D8r9PU8Whfb2yhQ078upHn6AkR1kmacpIIqVASj6gR4AZTiw9hFQI7IejpxXHfgnMUA7wO/fPApzAI2OXFyBOjuNz0aLjswqNEtPD+SvriC1vQ1CS0tZ98H347lw4WWz0NtbOQA0O0vmkqurkDk40DyNLH19YB0drSyAbW6Orxzy+Tm8f2soq7Ji97BNTwNg7VBJAH6TsTHeTP9iS7m5ASpJ35/7WJZqDIK6ASTX10Ganwdpagrks7OS5+OUkyYnQWJTMLW5WV0A5fERsicnhV5lqUVmb6/kNendXaBqFZc5OgL6/Fw9AOJ0AvlUtGPBU/LBHs/H+Q7Ht4p+w5wYAZyBAKSDQb6aOJaXS17jWFkB+voKSjwODr8fSJlfifAjH/Wy8tCMFovF6t8H6gB6AEhaUoBqmar5FQHCmUzGdACq5r8IEEzgCyqdCvNKGGpFzahdwF0fsiwHcO9BmkXGWp5OqA01qvskAqidfLHdZoI1V40yYLeH4NN2m/8CDABjQrVlFH0bYgAAAABJRU5ErkJggg==);
                                            background-size: 100% 100%;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }*/
</style>