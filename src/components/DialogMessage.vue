<template>
    <v-dialog
        :value="dialogMessage"
        max-width="600"
        persistent
        :fullscreen="$viewport.width < 450"
    >
        <v-card color="#061422">
            <v-card-title>
                <span
                    id="card-title"
                    class="dialog-message__title"
                >{{
                    dialogTitle
                }}</span>
                <v-spacer />
                <v-btn v-if="dismissible" icon @click="$emit('close')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <span>{{ dialogText }}</span>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialogMessage', 'dialogTitle', 'dialogText', 'dismissible'],
};
</script>

<style scoped>
span {
    color: #888;
    white-space: pre-line;
}

#card-title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.9;
}
</style>
