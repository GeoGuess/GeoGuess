export default {
    data() {
        return {
            canExit: false,
        };
    },
    methods: {
        beforeUnload(event) {
            event.returnValue = this.$t('StreetView.confirmExit');
        },
    },
    created() {
        window.addEventListener('beforeunload', this.beforeUnload);
    },
    beforeRouteLeave(_to, _from, next) {
        if (!this.canExit) {
            const answer = window.confirm(this.$t('StreetView.confirmExit'));
            if (answer) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.beforeUnload);
    },
};
