<template>
    <country-flag
        class="flag-icon"
        :rounded="rounded"
        :size="size"
        :country="isoName.toLowerCase()"
    />
</template>

<script>
import CountryFlag from 'vue-country-flag';
export default {
    name: 'FlagIcon',
    components: {
        CountryFlag,
    },
    props: {
        isoName: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: false,
            default: 'normal',
        },
        rounded: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
};
</script>
<style lang="scss">
.small-flag.rounded {
    -moz-border-radius: 15px !important;
    border-radius: 15px !important;
}
.normal-flag.rounded {
    -moz-border-radius: 10px !important;
    border-radius: 10px !important;
}
.big-flag.rounded {
    -moz-border-radius: 8px !important;
    border-radius: 8px !important;
}
</style>
