<template>
    <i :class="'flag-icon flag-icon flag-icon-' + isoName.toLowerCase()"></i>
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
.flag-icon {
    border-radius: 10%;
    --width-flag: 1em;

    width: calc((4 / 3) * var(--width-flag));
    line-height: var(--width-flag);
}
</style>
