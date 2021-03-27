export const CardRoomMixin = {
    created: function () {
        this.hello();
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
    },
};

export default CardRoomMixin;
