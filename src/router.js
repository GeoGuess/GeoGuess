import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/pages/Home';
import StreetView from '@/pages/StreetView';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/',
        },
        {
            path: '/',
            alias: '/index.html',
            name: 'home',
            component: Home,
        },
        {
            path: '/game/:partyParams',
            name: 'party',
            component: Home,
        },
        {
            path: '/room/:roomName',
            name: 'Room',
            component: Home,
        },
        {
            path: '/street-view',
            name: 'street-view',
            component: StreetView,
            props: (route) => ({
                multiplayer: false,
                ...route.params,
            }),
        },
        {
            path: '/street-view/with-friends',
            name: 'with-friends',
            component: StreetView,
            props: (route) => ({
                multiplayer: true,
                ...route.params,
            }),
        },
        {
            path: '/privacy-policy',
            name: 'privacy-policy',
            component: PrivacyPolicy,
        },
    ],
});
