<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomSize.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-slider
                        v-model="roomSize"
                        class="align-center"
                        max="20"
                        min="2"
                        step="1"
                        hide-details
                    >
                    </v-slider>
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="roomSize"
                        type="number"
                    ></v-text-field>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn dark depressed color="#FF5252" @click="cancel">{{
                $t('cancel')
            }}</v-btn>
            <v-btn dark depressed color="#43B581" @click="setRoomSize">{{
                $t('next')
            }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            roomSize: 2,
        };
    },
    methods: {
        setRoomSize() {
            this.$emit('setRoomSize', this.roomSize);
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
.roomSize-input {
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
