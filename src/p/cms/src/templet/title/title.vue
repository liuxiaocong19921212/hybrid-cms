<template>
    <h3 class="cms-title">
        <i></i><slot></slot>
        <slot name='subtitle'></slot>
        <slot name='subtitle2'></slot>
    </h3>
</template>
<script>
    export default ({

    })
</script>
<style lang="less">
@import '../../../../../b/components/src/core/less/var.less';
@import '../../../../../b/components/src/core/less/icon.less';
@import '../../../../../b/components/src/core/less/layout.less';
@import '../../../../../b/components/src/core/less/utils.less';
.cms-title {
    .set-line-height(1;.66rem;);
    background-color: @white;
    color: @gray-dark;
    font-size: @font-nm;
    border-bottom: 1px solid @gray-border;
    .flexbox();
    .flexbox.v_center();
    >i {
        display: block;
        margin-right: .2rem;
        width: .06rem;
        background-color: @red;
        height: .34rem;
    }
}
</style>
