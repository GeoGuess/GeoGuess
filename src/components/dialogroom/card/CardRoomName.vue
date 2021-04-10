<template>
    <v-card id="card-roomname">
        <v-card-title>
            <span id="card-title">{{ $t('CardRoomName.title') }}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            id="inputRoomName"
                            v-model="roomName"
                            maxlength="10"
                            autofocus
                            :error-messages="errorMessage"
                            @keyup.enter="searchRoom"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
                dark
                depressed
                color="#FF5252"
                @click="cancel"
            >
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                dark
                depressed
                color="#43B581"
                @click="searchRoom"
            >
                {{ $t('next') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import CardRoomMixin from './mixins/CardRoomMixin';
export default {
    mixins: [CardRoomMixin],
    props: ['errorMessage'],
    data() {
        return {
            roomName: '',
        };
    },
    methods: {
        searchRoom() {
            // Pass room name to parent component
            this.$emit('searchRoom', this.roomName);
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
