<template>
    <div class="search-box">
        <h2>{{ $tc('Home.placeVisited', nbPlaceVisits) }}</h2>

        <div class="search-box__btns">
            <v-btn
                class="search-box__btns__btn"
                rounded
                color="primary"
                large
                @click="openDialog()"
            >
                {{ $t('DialogRoom.singlePlayer') }}
            </v-btn>

            <v-btn
                class="search-box__btns__btn"
                rounded
                color="secondary"
                large
                @click="openDialog(false)"
            >
                {{ $t('DialogRoom.withFriends') }}
            </v-btn>
            <DialogRoom />
        </div>
        <div class="search-box__mapmenu">
            <v-btn
                text
                class="btn-customs"
                color="primary"
                height="50"
                @click="dialogCustom = !dialogCustom"
            >
                <v-icon>mdi-map-plus</v-icon> {{ $t('Home.createMap') }}
            </v-btn>
            <DialogCustomMap
                :visibility="dialogCustom"
                @change-visibility="changeDialogCustom"
            />
        </div>
    </div>
</template>
<script>
import DialogCustomMap from '@/components/home/DialogCustomMap';
import DialogRoom from '@/components/dialogroom/DialogRoom';
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {
        DialogRoom,
        DialogCustomMap,
    },
    props: {
        dialogCustomOpen: Boolean,
    },
    data() {
        return {
            dialogCustom: this.dialogCustomOpen,
        };
    },

    computed: {
        ...mapGetters(['nbPlaceVisits']),
    },

    watch: {
        dialogCustomOpen(v) {
            this.dialogCustom = v;
        },
    },

    mounted() {
        this.loadHistory();
    },
    methods: {
        ...mapActions(['loadHistory']),
        ...mapActions('settingsStore', ['openDialogRoom']),
        openDialog(isSinglePlayer) {
            this.openDialogRoom(isSinglePlayer);
        },
        changeDialogCustom() {
            this.dialogCustom = !this.dialogCustom;

            this.$router.push(this.dialogCustom ? '/custom' : '/');
        },
    },
};
</script>
<style lang="scss">
.search-box {
    h2 {
        text-align: center;
    }

    .v-input {
        font-size: 1.2rem !important;
    }
    &__btns {
        margin-top: 1.125rem;
        display: flex;
        justify-content: space-around;
        width: calc(100% - 50px);
        &__btn {
            width: 40%;
            padding: 0 5em;
            font-size: 1.1rem;
        }
    }
    &__mapmenu {
        text-align: center;
        margin-top: 3rem;
    }
}
@media (max-width: 410px) {
    .search-box {
        .v-input {
            font-size: 1rem !important;
            width: 95% !important;
            margin: auto !important;
        }
        .search-box__btns {
            margin-top: 0;
            flex-direction: column;
            .v-btn {
                width: 80%;
                margin: 2% auto;
            }
        }
    }
}
</style>
