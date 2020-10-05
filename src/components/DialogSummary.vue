<template>
    <v-dialog
        v-model="dialogSummary"
        max-width="720"
        persistent
        :fullscreen="$viewport.width < 450"
    >
        <v-card color="#061422">
            <v-card-text id="card-text">
                <v-row v-if="!multiplayer" justify="center">
                    <span
                        id="summary-text"
                        v-html="
                            $t('DialogSummary.summaryMsgSingle', {
                                distance: score / 1000,
                                points,
                            })
                        "
                    ></span>
                </v-row>
                <v-row
                    class="mt-3"
                    justify="center"
                    v-for="(text, index) in summaryTexts"
                    :key="index"
                >
                    <span id="summary-text">
                        <v-icon
                            v-if="index == 0 || index == 1 || index == 2"
                            :color="
                                index == 0
                                    ? '#FAA61A'
                                    : index == 1
                                    ? '#EEEEEE'
                                    : '#F4511E'
                            "
                            >mdi-crown</v-icon
                        >
                        <span
                            v-html="
                                $t('DialogSummary.summaryMsgMulti', {
                                    playerName: text.playerName,
                                    points: text.finalPoints,
                                    distance: text.finalScore / 1000,
                                })
                            "
                        ></span>
                    </span>
                </v-row>
                <v-row class="mt-8" justify="center">
                    <v-btn
                        id="play-again-button"
                        class="mt-8"
                        dark
                        color="#43B581"
                        @click="$emit('view-details')"
                        >{{ $t('DialogSummary.viewDetails') }}</v-btn
                    >
                </v-row>
            </v-card-text>
            <v-card-text class="text-right">
                <v-btn
                    target="_blank"
                    :href="
                        'http://www.facebook.com/sharer.php?u=' +
                        url +
                        '&amp;t=I am ' +
                        score / 1000 +
                        ' km away! How close can you guess?'
                    "
                    rel="nofollow"
                    icon
                >
                    <v-icon size="32">mdi-facebook-box</v-icon>
                </v-btn>
                <v-btn
                    target="_blank"
                    :href="
                        'http://twitter.com/share?url=' +
                        url +
                        '&amp;text=I am ' +
                        score / 1000 +
                        ' km away! How close can you guess?'
                    "
                    icon
                >
                    <v-icon size="32">mdi-twitter-box</v-icon>
                </v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [
        'dialogSummary',
        'summaryTexts',
        'playerName',
        'score',
        'points',
        'multiplayer',
        'game',
    ],
    data() {
        return {
            url: process.env.URL,
        };
    },
    methods: {
        updateRecord() {
            var currentRecord = localStorage.getItem('record');
            if (currentRecord == null || this.score < currentRecord) {
                localStorage.setItem('record', this.score);
            }
            let history = localStorage.getItem('history');
            if (history == null) {
                history = [];
            } else {
                history = JSON.parse(history);
            }
            history.push({
                ...this.game,
                score: this.score,
                points: this.points,
                rank: this.multiplayer
                    ? this.summaryTexts.findIndex(
                          (text) => text.playerName === this.playerName
                      ) + 1
                    : undefined,
            });
            localStorage.setItem('history', JSON.stringify(history));
        },
        finishGame() {
            this.$emit('finishGame');
        },
    },
    watch: {
        dialogSummary: function (newVal) {
            if (newVal == true) {
                this.updateRecord();
            }
        },
    },
};
</script>

<style scoped>
#exit-button,
#play-again-button {
    height: 44px;
    width: 210px;
    border-radius: 40px;
}

#card-text {
    padding: 80px 10% 80px 10%;
}

#summary-text {
    font-size: 18px;
    opacity: 0.9;
}

@media (max-width: 450px) {
    #exit-button,
    #play-again-button {
        height: 36px;
    }

    #exit-button {
        margin-top: 28px;
        margin-bottom: 24px;
    }
}
</style>
