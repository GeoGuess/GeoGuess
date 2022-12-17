<template>
    <v-app>
        <router-view />
        <v-alert
            v-model="updateAvailable"
            id="alertUpdate"
            dark
            type="info"
            elevation="3"
            prominent
            dismissible
        >
            <v-row align="center">
                <v-col class="grow">
                    {{$t('AlertUpdate.label')}}
                </v-col>
                <v-col class="shrink">
                    <v-btn @click="refreshApp">{{$t('AlertUpdate.btn')}}</v-btn>
                </v-col>
            </v-row>
        </v-alert>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            refreshing: false,
            registration: null,
            updateAvailable: false
        };
    },
    created() {
        // Listen for our custom event from the SW registration
        document.addEventListener('swUpdated', this.setUpdate, { once: true });
        if(navigator.serviceWorker)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                // Prevent multiple refreshes
                if (this.refreshing) return;
                this.refreshing = true;

                window.location.reload();
            });
    },
    methods:{
        setUpdate(event) {
            this.registration = event.detail;
            this.updateAvailable = true;
        },

        refreshApp() {
            this.updateAvailable = false;
            if (!this.registration || !this.registration.waiting)
                return;
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        },
    }
};
</script>

<style lang="scss" scoped>
#alertUpdate{
    position: fixed;
    bottom: 2%;
    right: 5%;
    width: 90%;
}
</style>

<style>
.gm-style {
  background-color: var(--v-gmapBg-base) !important;
}
</style>
