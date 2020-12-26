import { setup } from 'axios-cache-adapter';
import Vue from 'vue';
import VueAxios from 'vue-axios';

const axi = setup({
    cache: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        exclude: { query: false },
    },
});

Vue.use(VueAxios, axi);

export default axi;
