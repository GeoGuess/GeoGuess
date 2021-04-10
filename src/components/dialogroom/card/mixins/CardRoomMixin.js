export const CardRoomMixin = {
    methods: {
        cancel() {
            this.$emit('cancel');
        },
    },
};

export default CardRoomMixin;
