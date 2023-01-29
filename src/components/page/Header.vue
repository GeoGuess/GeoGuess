<template>
    <div>
        <v-app-bar class="header" height="100">
            <router-link to="/">
                <img class="header__logo" src="@/assets/geoguessLogo.png" />
                <img
                    class="header__logo-min"
                    src="@/../public/img/icons/android-icon-72x72.png"
                />
            </router-link>

            <div class="flex-grow-1" />

            <v-app-bar-nav-icon
                class="header__nav-icon"
                @click="menuMobile = !menuMobile"
            ></v-app-bar-nav-icon>
            <nav class="header__nav" :class="{ visible: menuMobile }">
                <v-btn id="historyBtn" text link to="/history">
                    {{ $t('Home.historyBtn') }}
                </v-btn>
                <v-btn id="historyBtn" text link to="/medals">
                    {{ $t('Home.medalsBtn') }}
                </v-btn>
                <div class="header__nav__btns">
                    <v-btn id="aboutBtn" icon @click="aboutDialog = true">
                        <v-icon size="30"> mdi-help-circle </v-icon>
                    </v-btn>
                    <v-btn icon @click="changeStreamerMode(!streamerMode)">
                        <v-icon size="30">
                            mdi-eye{{ streamerMode ? '-off' : '' }}
                        </v-icon>
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn id="languageBtn" icon v-on="on">
                                <v-icon size="30"> mdi-translate </v-icon>
                            </v-btn>
                        </template>
                        <v-list id="menuLanguage">
                            <v-list-item
                                v-for="(language, index) in languages"
                                :key="index"
                                @click="switchLanguage(language.value)"
                            >
                                <v-list-item-title>
                                    {{ language.text }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn icon @click="changeTheme(!darkTheme)">
                        <v-icon size="30">
                            {{ darkTheme ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }} }}
                        </v-icon>
                    </v-btn>
                </div>
            </nav>
            <v-dialog v-model="aboutDialog">
                <About />
            </v-dialog>
        </v-app-bar>

        <v-alert v-if="demoMode" color="#7289DA" dark class="demo-alert">
            <v-row align="center">
                <v-col class="grow">
                    {{ $t('Demo.message') }}
                </v-col>
                <v-col class="shrink">
                    <v-btn target="_blank" href="https://discord.gg/9GXm6RT">
                        <v-icon left> mdi-discord </v-icon>
                        {{ $t('Demo.btn') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-alert>
        <HeaderAlert />
    </div>
</template>
<script>
import About from '@/components/page/About';
import { languages, RTL_LANGUAGES } from '../../lang';
import { mapActions, mapState } from 'vuex';
import HeaderAlert from './HeaderAlert.vue';

export default {
    components: {
        About,
        HeaderAlert,
    },
    data() {
        return {
            aboutDialog: false,
            languages,
            menuMobile: false,
        };
    },
    computed: {
        ...mapState({
            streamerMode: (state) => state.homeStore.streamerMode,
        }),
        demoMode() {
            return !!process.env.VUE_APP_DEMO_MODE;
        },
        darkTheme() {
          return this.$vuetify.theme.dark;
        }
    },
    methods: {
        ...mapActions(['setStreamerMode']),
        changeStreamerMode(streamerMode) {
            this.setStreamerMode(streamerMode);
        },
        switchLanguage(language) {
            this.$root.$i18n.locale = language;
            this.$vuetify.lang.current = language;
            this.$vuetify.rtl = RTL_LANGUAGES.includes(language);
            this.saveLanguage(language);
        },
        saveLanguage(language) {
            localStorage.setItem('language', language);
        },
        changeTheme(dark) {
          this.$vuetify.theme.dark = dark;
          localStorage.setItem('darkTheme', dark);
        }
    },
};
</script>
<style lang="scss" scoped>
.header {
    z-index: 1;
    padding: 0 5%;
    background-color: var(--v-header-base) !important;
    .header__nav,
    .header__nav__btns {
        display: flex;
        align-items: center;        
        & > div {
            margin: 0 1.5rem;
        }
    }
    .theme--light .header__nav__btns .v-btn{
        color: rgba(0, 0, 0, 0.87);
        margin: 0.25rem;
    }
    .theme--dark .header__nav__btns .v-btn{
        color: rgba(196, 110, 110, 0.87);
        margin: 0.25rem;
     }
    .v-btn {
        a {
            text-decoration: none;
            color: initial;
        }
        font-size: 1.2rem;
    }
    .header__logo {
        height: 5rem;
        width: auto;
    }
    .header__logo-min {
        display: none;
    }
    .header__nav-icon {
       display: none;
    }
}

@media (max-width: 840px) {
    .header {
        .header__logo {
            display: none;
        }
        .header__logo-min {
            display: block;
        }
        .header__nav {
            &:not(.visible) {
                display: none;
            }
            position: absolute;
            top: 6.2rem;
            right: 0rem;
            background: var(--v-header-base);
            padding: 1rem;
            box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%);
            border-bottom-left-radius: 0.3125rem;
            border-bottom-right-radius: 0.3125rem;
            max-width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            overflow-y: auto;
            .header__nav__btns {
                margin: 0;
            }
        }
        .header__nav-icon {
            display: flex;
        }
    }
}
</style>
