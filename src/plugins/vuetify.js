import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import { cs, de, en, es, fr, he, hu, it, ja, pt, ru, sv, tr } from 'vuetify/locale';
import { RTL_LANGUAGES } from '../lang';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import '../scss/variables.scss';

export default function vuetifyConstructor(i18n) {
    return createVuetify({
        components,
        directives,
        theme: {
            defaultTheme:
                localStorage.getItem('darkTheme') === 'true' ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches &&
                    localStorage.getItem('darkTheme') !== 'false')
                    ? 'dark'
                    : 'light',
            themes: {
                light: {
                    dark: false,
                    colors: {
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
                    },
                },
                dark: {
                    dark: true,
                    colors: {
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
                    },
                },
            },
        },
        locale: {
            locale: i18n.global.locale.value,
            fallback: 'en',
            messages: { en, fr, ja, cs, de, ru, pt, sv, tr, he, it, hu, es },
            rtl: RTL_LANGUAGES.includes(i18n.global.locale.value) ? { en: false, [i18n.global.locale.value]: true } : {},
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
    });
}
