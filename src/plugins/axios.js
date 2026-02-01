import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const instance = axios.create();

const cachedAxios = setupCache(instance, {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
});

export default cachedAxios;
