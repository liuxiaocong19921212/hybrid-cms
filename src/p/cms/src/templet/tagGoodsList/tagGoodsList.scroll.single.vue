<script type="text/javascript">
import goodsTemplet from '../goods/goodsTemplet.js'
import base from './tagGoodsList.scroll.vue'
export default (
    Vue.extend({
        mixins: [base],
        components: {
            'products': goodsTemplet.single
        },
        data: function(){
            return {
                className: 'tagGoodsList single'
            }
        }
    })
)
</script>
<style lang="less">

</style>
