<template>
    <div class="page">
        <Header class="page__header" />

        <slot />

        <Footer class="page__footer" />
    </div>
</template>

<script>
import Header from '@/components/page/Header';
import Footer from '@/components/page/Footer';
export default {
    components: {
        Header,
        Footer,
    },
};
</script>

<style scoped lang="scss">
.page {
    display: grid;

    min-height: 100%;
    grid-template-rows: auto 1fr auto;
    .demo-alert {
        position: absolute;
        z-index: 1;
        width: 100%;
    }
    background-color: #ded3af;
}
</style>
