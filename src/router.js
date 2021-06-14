import Home from '@/pages/Home';
import { GAME_MODE } from './constants';
import StreetView from '@/pages/StreetView';
import HistoryPage from '@/pages/HistoryPage';
import Vue from 'vue';
import Router from 'vue-router';

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
            path: '/history',
            name: 'History',
            component: HistoryPage,
        },
        {
            path: '/street-view/:modeSelected/:time',
            name: 'street-view',
            component: StreetView,
            props: (route) => ({
                multiplayer: false,
                ...route.params,
                time: parseInt(route.params.time, 10),
            }),
            beforeEnter: (to, from, next) => {
                let enterGame = true;
                if (
                    !Object.values(GAME_MODE).includes(to.params.modeSelected)
                ) {
                    enterGame = false;
                }

                if (isNaN(to.params.time) || to.params.time < 0) {
                    enterGame = false;
                }

                if (enterGame) {
                    next();
                } else {
                    next('/');
                }
            },
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
    ],
});
