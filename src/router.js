import HistoryPage from '@/pages/HistoryPage.vue';
import Home from '@/pages/Home.vue';
import MedalsPage from '@/pages/MedalsPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { GAME_MODE } from './constants';

const StreetView = () => import('@/pages/StreetView.vue');

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
        {
            path: '/',
            alias: '/index.html',
            name: 'home',
            component: Home,
        },
        {
            path: '/custom',
            name: 'home custom',
            component: Home,
            props: () => ({
                dialogCustomOpen: true,
            }),
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
            path: '/medals',
            name: 'Medals',
            component: MedalsPage,
        },
        {
            path: '/street-view/:modeSelected/:time',
            name: 'street-view',
            component: StreetView,
            props: (route) => ({
                multiplayer: false,
                ...route.params,
                time: parseInt(route.params.time, 10),
                nbRoundSelected: route.params.nbRoundSelected ? parseInt(route.params.nbRoundSelected, 10) : 5,
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
                nbRoundSelected: route.params.nbRoundSelected ? parseInt(route.params.nbRoundSelected, 10) : 5,
            }),
        },
    ],
});

export default router;
