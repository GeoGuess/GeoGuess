import Vue from 'vue';

import cs from 'vuetify/es5/locale/cs';
import de from 'vuetify/es5/locale/de';
import en from 'vuetify/es5/locale/en';
import es from 'vuetify/es5/locale/es';
import fr from 'vuetify/es5/locale/fr';
import he from 'vuetify/es5/locale/he';
import hu from 'vuetify/es5/locale/hu';
import ja from 'vuetify/es5/locale/ja';
import pt from 'vuetify/es5/locale/pt';
import ru from 'vuetify/es5/locale/ru';
import sv from 'vuetify/es5/locale/sv';
import tr from 'vuetify/es5/locale/tr';
import it from 'vuetify/es5/locale/it';

import Vuetify from 'vuetify/lib';
import { RTL_LANGUAGES } from '../lang';
import '../scss/variables.scss';

Vue.use(Vuetify);

export default function vuetifyConstructor(i18n) {
    return new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#468F69',
                    secondary: '#808F87',
                    accent: '#D0CABC',
                    beige: '#ded3af',
                    darkGreen: '#4F665A',
                    streamerMode: '#9146ff',
                    error: '#ff5252',
                    background: '#ded3af',
                    home: '#ded3af',
                    header: '#f1e9d6',
                    card: '#f1e9d6',
                    notepad: '#fafafa',
                    page: '#ded3af',
                    content: '#f1e9d6',
                    footer: '#7fad94',
                    scrollbar: '#3e3e3e',
                    gmap: [],
                },
                dark: {
                    primary: '#468F69',
                    secondary: '#808F87',
                    accent: '#D0CABC',
                    beige: '#181818',
                    darkGreen: '#5d8772',
                    streamerMode: '#9146ff',
                    error: '#ff5252',
                    background: '#181818',
                    home: '#181818',
                    header: '#202020',
                    card: '#292929',
                    notepad: '#181818',
                    page: '#181818',
                    content: '#202020',
                    footer: '#202020',
                    scrollbar: '#3e3e3e',
                    gmapBg: '#242f3e',
                    gmap: [
                        {
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#242f3e',
                                },
                            ],
                        },
                        {
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#c0c0c0',
                                },
                            ],
                        },
                        {
                            elementType: 'labels.text.stroke',
                            stylers: [
                                {
                                    color: '#242f3e',
                                },
                            ],
                        },
                        {
                            featureType: 'administrative',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#485373',
                                },
                                {
                                    visibility: 'on',
                                },
                            ],
                        },
                        {
                            featureType: 'administrative.locality',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#c0c0c0',
                                },
                            ],
                        },
                        {
                            featureType: 'landscape.man_made',
                            elementType: 'geometry.stroke',
                            stylers: [
                                {
                                    color: '#38414e',
                                },
                                {
                                    visibility: 'on',
                                },
                            ],
                        },
                        {
                            featureType: 'landscape.natural.landcover',
                            elementType: 'geometry.fill',
                            stylers: [
                                {
                                    visibility: 'simplified',
                                },
                            ],
                        },
                        {
                            featureType: 'poi',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#c0c0c0',
                                },
                            ],
                        },
                        {
                            featureType: 'poi.park',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#263c3f',
                                },
                            ],
                        },
                        {
                            featureType: 'poi.park',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#6b9a76',
                                },
                            ],
                        },
                        {
                            featureType: 'road',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#38414e',
                                },
                            ],
                        },
                        {
                            featureType: 'road',
                            elementType: 'geometry.stroke',
                            stylers: [
                                {
                                    color: '#212a37',
                                },
                            ],
                        },
                        {
                            featureType: 'road',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#9ca5b3',
                                },
                            ],
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#746855',
                                },
                            ],
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry.stroke',
                            stylers: [
                                {
                                    color: '#1f2835',
                                },
                            ],
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#f3d19c',
                                },
                            ],
                        },
                        {
                            featureType: 'transit',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#2f3948',
                                },
                            ],
                        },
                        {
                            featureType: 'transit.station',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#d59563',
                                },
                            ],
                        },
                        {
                            featureType: 'water',
                            elementType: 'geometry',
                            stylers: [
                                {
                                    color: '#17263c',
                                },
                            ],
                        },
                        {
                            featureType: 'water',
                            elementType: 'labels.text.fill',
                            stylers: [
                                {
                                    color: '#515c6d',
                                },
                            ],
                        },
                        {
                            featureType: 'water',
                            elementType: 'labels.text.stroke',
                            stylers: [
                                {
                                    color: '#17263c',
                                },
                            ],
                        },
                    ],
                },
            },
            options: {
                customProperties: true,
            },
            dark:
                localStorage.getItem('darkTheme') === 'true' ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                    localStorage.getItem('darkTheme') !== 'false'),
        },
        rtl: RTL_LANGUAGES.includes(i18n.locale),
        lang: {
            locales: { en, fr, ja, cs, de, ru, pt, sv, tr, he, it, hu, es },
            current: i18n.locale,
        },
        icons: {
            iconfont: 'mdi',
        },
    });
}
