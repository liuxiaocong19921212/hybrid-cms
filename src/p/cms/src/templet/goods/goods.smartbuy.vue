<template>
    <div class="info-compare">
        <div class="wrapper">
            <p class="compare-price">
                比{{data.compare.competitor}}&yen;{{data.compare.competitorPrice}}&nbsp;<em>低{{data.compare.discountPrice}}元</em>
            </p>
            <p class="compare-time">
                比价时间 {{data.compare.lastModifiedTime}}
            </p>    
        </div>
    </div>
</template>
<script>
    export default ({
        props:['data'],
        created: function(){

        }
    })
</script>
<style lang='less'>

    @import '../../../../../b/components/src/core/less/var.less';
    @import '../../../../../b/components/src/core/less/layout.less';
    @import '../../../../../b/components/src/core/less/utils.less';
    @import 'goods.less';
.list {
    .product {
        .info-compare {
            font-size: @font-nm-sm;
            color: @white;
            background-color: rgba(255,22,22,.7);
            .set-line-height(1;@font-nm-sm * 1.5);
            padding: 0 @font-nm-sm/3;
            overflow: hidden;
            .wrapper {
                .set-line-height(2;@font-nm-sm * 1.5);
                -webkit-animation:  info-compare 15s infinite;
                position: relative;
                p {
                    .set-line-height(1;@font-nm-sm * 1.5);
                    font-size:  @font-nm-sm;
                }
                .compare-time {
                    font-size:  @font-sm;
                }
            }
            em {
                font-weight: bold;
            }
        }
    }
}
@-webkit-keyframes info-compare {
    0% {
        -webkit-transform: translateY(0);
    }
    60% {
        -webkit-transform: translateY(0);
    }
    65% {
        -webkit-transform: translateY(-50%);
    }
    95% {
        -webkit-transform: translateY(-50%);
    }
    97.5% {
        -webkit-transform: translateY(-100%);
    }
    97.51% {
        -webkit-transform: translateY(100%);
    }
    100% {
        -webkit-transform: translateY(0);
    }
}
</style>