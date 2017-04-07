<script type="text/javascript">
import goodsTemplet from '../goods/goodsTemplet.js'
import priceGetter from '../goods/goods.mixin.vue'
import base from './tagGoodsList.scroll.vue'
export default (
    Vue.extend({
        mixins: [base],
        components: {
            'products': goodsTemplet.double
        },
        data: function(){
            return {
                className: 'tagGoodsList double'
            }
        }
    })
)
</script>
<style lang="less">

</style>
