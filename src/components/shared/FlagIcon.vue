<template>
    <span :class="'flag-icon flag-icon-' + isoName.toLowerCase()"></span>
</template>

<script>
export default {
    name: 'FlagIcon',
    props: ['isoName'],
};
</script>
<style lang="scss">
$flag-icon-css-path: '../../../node_modules/flag-icon-css/flags';
@import '../../../node_modules/flag-icon-css/sass/flag-icon.scss';
</style>
