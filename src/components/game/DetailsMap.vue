<template>
    <div
        v-if="
            properties &&
                typeof properties === 'object' &&
                (properties.title || properties.description)
        "
        class="details-map_container"
    >
        <h2>
            {{ properties.title }}
        </h2>
        <p>
            {{ properties.description }}
        </p>
        <a
            v-if="properties.link && validURL(properties.link)"
            :href="properties.link"
            target="_blank"
            class="details-map_link"
        ><v-icon color="darkGreen">mdi-alert-circle</v-icon>
            {{ $t('DetailsMap.moreInfo') }}</a>
    </div>
</template>

<script>
import { validURL } from '@/utils';
export default {
    name: 'DetailsMap',
    props: ['properties'],
    methods: {
        validURL(url) {
            return validURL(url);
        },
    },
};
</script>

<style lang="scss" scoped>
.details-map_container {
    background: #ded3af;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 1% 2%;
    color: black;
    position: relative;
    .details-map_link {
        right: 0.6rem;
        position: absolute;
        bottom: 0.4rem;
        text-decoration: none;
        font-size: 0.9rem;
        vertical-align: middle;
        .v-icon {
            font-size: 1.2rem;
        }
    }
}
</style>
