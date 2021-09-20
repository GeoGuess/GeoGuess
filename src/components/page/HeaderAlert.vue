<template>
    <v-alert
        v-if="!!alert"
        type="success"
        dismissible
        transition="slide-x-reverse-transition"
        class="header-alert"
        :icon="alert.icon"
        :color="alert.color"
        @input="closeAlert"
    >
        <h4>{{ $t(alert.title) }}</h4>
        <p>{{ $t(alert.subtitle) }}</p>
    </v-alert>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    computed: {
        ...mapState('alertStore', ['alert']),
    },
    methods: {
        ...mapActions('alertStore', ['setAlert']),
        closeAlert(v) {
            !v && this.setAlert(null);
        },
    },
};
</script>

<style lang="scss">
.header-alert {
    width: fit-content;
    position: absolute;
    z-index: 210;
    right: 0;
    margin: 0.625rem;
}
</style>
