<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomRules.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-slider
                        v-model="moves"
                        class="align-center"
                        max="500"
                        min="-1"
                        step="1"
                        hide-details
                    >
                    </v-slider>
                </v-row>
                <v-row>
                    <div class="moves-input" v-if="this.moves >= 0">
                        <v-text-field
                            v-model="moves"
                            type="number"
                        ></v-text-field>
                    </div>
                    <p v-else class="infinite--text">
                        {{ $t('CardRoomRules.infinite') }}
                    </p>
                </v-row>
                <v-row>
                    <v-switch
                        v-model="zoom"
                        class="align-center"
                        :label="$t('CardRoomRules.zoom')"
                    >
                    </v-switch>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setRules">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            moves: -1,
            zoom: true,
        };
    },
    methods: {
        setRules() {
            this.$emit('setRules', [this.moves, this.zoom]);
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>

<style lang="scss" scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
.rounds-input {
    display: flex;
    margin: auto;
    p {
        line-height: 4;
        margin: 0 1rem;
    }
    .v-input {
        width: 10rem;
    }
}
</style>
