/**
 * 商品的购物车逻辑的mixin
 * @Author zhaoye
 * @Created-Date: 2016-11-16
 * @Last-Modified-Date: 2016-11-16
 * @Last-Modified-By: zhaoye
 */
<script>
    export default ({
        data: function(){
            return {
                cartType: '',
            }
        },
        created: function(){
            if(this.showCartFlag == 1 || this.showCartFlag == 2){
                this.cartType = 'icon'
            }else if(this.showCartFlag == 3 || this.showCartFlag == 4){
                this.cartType = 'btn'
            }
            //各种类型商品，购物车文案的区别
            this.$watch('data.state', function(state){
                //已结束
                if(state == 3){
                    this.data.productState = '已结束'
                }
            })
        },
        methods: {
            /*
             * 点击加入购物车逻辑
             */
            onCartBtnClick:function(event){
                //目前混合app才有的逻辑
                //this.data.showButtonFlag 1=商品详情，2=加入购物车
                if($g.env.hybrid && this.showButtonFlag == 2){
                    //普通和专享都加入购物车
                    if(this.data.productType == 'normal' || this.data.productType == 'exclusive' || this.data.productType == 'overseas'){
                        this.$dispatch('addCart',{
                        skuId:this.data.skuId,
                        goodsNo:this.data.goodsNo,
                        goodsType:this.data.goodsType
                    });
                    }else{
                        window.jump(this.data.href,event);
                    }
                }else{
                    window.jump(this.data.href,event);
                }
            }
        }
    })
</script>