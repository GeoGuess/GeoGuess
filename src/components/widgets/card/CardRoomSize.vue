<template>
    <v-card>
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomSize.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="4">
                        <v-autocomplete
                            v-model="roomSize"
                            :items="roomSizeItems"
                            autofocus
                            v-on:keyup.enter="searchRoom"
                        ></v-autocomplete>
                    </v-col>
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
            roomSizeItems: [
                {
                    text: '2',
                    value: 2,
                },
                {
                    text: '3',
                    value: 3,
                },
                {
                    text: '4',
                    value: 4,
                },
                {
                    text: '5',
                    value: 5,
                },
                {
                    text: '5',
                    value: 5,
                },
                {
                    text: '6',
                    value: 6,
                },
                {
                    text: '7',
                    value: 7,
                },
                {
                    text: '8',
                    value: 8,
                },
                {
                    text: '9',
                    value: 9,
                },
                {
                    text: '10',
                    value: 10,
                },
                {
                    text: '11',
                    value: 11,
                },
                {
                    text: '12',
                    value: 12,
                },
            ],
        };
    },
    methods: {
        setRoomSize() {
            // Pass room size to parent component
            this.$emit('setRoomSize', this.roomSize);
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>

<style scoped>
#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
</style>
