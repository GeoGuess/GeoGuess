import { setup } from 'axios-cache-adapter';

const axi = setup({
    cache: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        exclude: { query: false },
    },
});

export default axi;
