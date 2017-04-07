/**
 * 全局的关于模块的内边距和边线的样式的混合
 * @Author: zhaoye
 * @Created-Date: 2016-11-02
 * @Last-Modefied-Date: 2016-11-02
 * @Last-Modefied-By: zhaoye
 */
<script>
    export default ({
        methods: {
            borderStyle: function(type){
                var style = ''
                switch(type){
                    case 0:
                        style = 'no-border';
                        break;
                    case 1:
                        style = 'all-border';
                        break;
                    case 2:
                        style = 'inside-border';
                        break;
                    case 3:
                        style = 'top-border';
                        break;
                    case 4:
                        style = 'bottom-border';
                        break;
                }
                return style;
            },
            paddingStyle: function(type){
                if(type == 1)
                    return 'has-padding'
                else
                    return ''
            }
        }
    })
</script>