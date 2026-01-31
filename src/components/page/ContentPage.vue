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
    background-color: var(--v-page-base);
}
</style>

<style lang="scss" scoped>
.page .content {
    background: var(--v-content-base);
    &--no-background {
        background: none;
    }
    margin: 2.5% 5%;
    border-radius: 5px;
    padding: 2%;
}
</style>

