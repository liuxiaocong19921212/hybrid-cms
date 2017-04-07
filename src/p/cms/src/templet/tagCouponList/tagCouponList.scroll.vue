//tagCouponList.scroll.vue
<template>
    <div :style="fixBlocker"></div>
    <tab-nav-scroll
        v-if="scroll"
        :list="data"
        :options="optionsTab">
    </tab-nav-scroll>
    <tab-nav
        v-else
        :list="data"
        :options="optionsTab">
    </tab-nav>
    <swiper  v-bind:options="options"  v-bind:list="data" :style=[style]>
       <slider v-ref:sliders v-for="item in data" v-bind:options="options" slot="slider">
           <p style="font-size:.2rem;height:8rem;text-align:center;padding-top:1rem">loading...</p>
       </slider>
    </swiper>

</template>
<script>
    import Transformer from '../../utils/dataTransformer.js'
    import comps from 'components'
    import couponListDouble from './couponList.double.vue'
    import title from '../title/title.vue'

    export default ({
        components: {
            'tab-nav-scroll': comps.TabNavScroll,
            'tab-nav': comps.TabNav,
            'swiper': comps.Swiper,
            'slider': comps.Slider,
            'title': title,
        },
        data: function(){
            return {
                idx: 0,
                style: {
                    'height': 'auto',
                    /*'transition': 'height .3s'*/
                },
                options: {
                    'autoPlay': false,
                    'loop': false,
                    'perSliders': 1,
                    'wrapperWidth': document.body.offsetWidth
                },
                optionsTab: {
                    'autoPlay': false,
                    'loop': false,
                    'perSliders': 3.5,
                    'wrapperWidth': document.body.offsetWidth
                },
                cellHeight: 0,
                children: {}
            }
        },
        events: {
            clickOne: function(idx){
                this.$broadcast('scrollTo',idx)
            },
            scrollTo: function(idx){
                //if(idx != this.idx)
                //    this.idx = idx;
                //else
                //    return;
                var _scope = this;
                this.children[idx].isShow = true;
                this.$broadcast('setActive',idx)
                //if(!this.children[this.idx]){
                setTimeout(function() {
                    _scope.style.height = _scope.$refs.sliders[idx].$el.children[0].clientHeight + 'px';
                },100)
                //}else{
            //       _scope.cellHeight = _scope.$refs.sliders[_scope.idx].$el.children[0].offsetHeight;
                //}
            }
        },
        created: function(){
            var _scope = this;
            //this.$watch('cellHeight',function(){
            //    this.style.height = this.cellHeight+'px'
            //})
        },
        ready: function(){
            var _scope = this;
            if(_scope.data.prodRowNum == 1){
                /*this.children[0] = new couponListDouble({
                    el: this.$refs.sliders[0].$el,
                    replace: false,
                    'data': {
                        'data': Transformer.transGoods(this.data.tagGoodsList[0].goodsList)
                    }
                })*/
            }else{
                for(var i=0; i<this.data.length; i++){
                    this.children[i] = new couponListDouble({
                        el: this.$refs.sliders[i].$el,
                        replace: false,
                        'data': {
                            'data': this.data[i],
                            'idx': i,
                            'isShow': i == 0 ? true : false
                        }
                    })
                }
            }
        }
    })
</script>
