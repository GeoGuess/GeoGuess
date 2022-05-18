<template>
    <div>
        <v-app-bar class="header-game" color="grey darken-4">
            <div v-if="remainingTime != null && remainingTime > 0">
                <span id="countdown-text">{{ countdownText }}</span>
            </div>

            <div v-else>
                <span id="countdown-text">{{ timerText }}</span>
            </div>
            <div
                v-if="roomName && !streamerMode"
                class="round-score-container room-name"
            >
                <span class="sub-text">{{ $t('HeaderGame.room') }} : </span>
                <span class="main-text">
                    {{ roomName }}
                </span>
            </div>
            <div class="flex-grow-1" />
            <div class="round-score-container">
                <span class="sub-text">{{ $t('HeaderGame.round') }}: </span>
                <span id="roundLabel" class="main-text">
                    {{ round }} / {{ nbRound }}
                </span>
            </div>
            <div v-if="isDistanceVisible" class="round-score-container">
                <span class="sub-text">{{ $t('HeaderGame.distance') }}: </span>
                <span class="main-text">{{
                    $t('HeaderGame.kmaway', {
                        value: new Intl.NumberFormat($i18n.locale).format(
                            distance / 1000
                        ),
                    })
                }}</span>
            </div>
            <div class="round-points-container">
                <span class="sub-text">{{ $t('HeaderGame.score') }}: </span>
    
                <span class="main-text">{{ points }}</span>
            </div>
        </v-app-bar>
    </div>
</template>

<script>
import { getCountdownText } from '@/utils';
import { GAME_MODE } from '../constants';
import { mapState } from 'vuex';
export default {
    props: [
        'distance',
        'points',
        'round',
        'remainingTime',
        'roomName',
        'nbRound',
    ],
    data() {
        return {
            startedAt: null,
            timerText: '',
            intervalFunction: null,
        };
    },
    watch: {
        round: function () {
            this.startTimer();
        },
    },
    computed: {
        ...mapState({
            streamerMode: (state) => state.homeStore.streamerMode,
        }),
        countdownText() {
            return getCountdownText(this.remainingTime);
        },
        isDistanceVisible() {
            return this.mode !== GAME_MODE.COUNTRY;
        },
    },
    methods: {
        startTimer() {
            if (this.remainingTime != 0) {
                return;
            }
            this.startedAt = new Date();

            this.intervalFunction = setInterval(() => {
                this.timerText = getCountdownText(
                    Math.round((Date.now() - this.startedAt) / 1000)
                );
            }, 1000);
        },
        stopTimer() {
            if (this.intervalFunction) {
                clearInterval(this.intervalFunction);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.header-game {
    z-index: 3;
    opacity: 0.8;
}

.toolbar-title {
    color: white;
}

.round-score-container {
    padding: 0 10px 0 40px;
}

.round-points-container {
    padding: 0 10px 0 40px;
}

.main-text,
#countdown-text {
    color: white;
}

.sub-text {
    color: #616161;
}
@media (max-width: 555px) {
    .room-name {
        display: none;
    }
    .main-text,
    .sub-text,
    #countdown-text {
        font-size: 14px;
    }

    .round-score-container {
        padding: 0 5%;
        .sub-text {
            display: none;
        }
    }

    .round-points-container {
        padding: 0 5%;
        .sub-text {
            display: none;
        }
    }
}
</style>
