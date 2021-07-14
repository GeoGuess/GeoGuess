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
            
            <v-app-bar-nav-icon class="header__nav-icon" @click="menuMobile = !menuMobile"></v-app-bar-nav-icon>
            <nav class="header__nav" :class="{visible: menuMobile}">
                <v-btn id="historyBtn" text>
                    <router-link to="/history">
                        {{ $t('Home.historyBtn') }}
                    </router-link>
                </v-btn>
                <div class="header__nav__btns">
                    <v-btn id="aboutBtn" text @click="aboutDialog = true">
                        <v-icon size="30"> mdi-help-circle </v-icon>
                    </v-btn>
                    <v-btn text @click="changeStreamerMode(!streamerMode)">
                        <v-icon size="30">
                            mdi-eye{{ streamerMode ? '-off' : '' }}
                        </v-icon>
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn id="languageBtn" text v-on="on">
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
        <v-alert
            type="success"
            v-model="showAlertStreamerMode"
            dismissible
            transition="slide-x-reverse-transition"
            id="alertStreamerMode"
            icon="mdi-twitch"
            color="streamerMode"
        >
            <h4>{{ $t('Home.streamerModeActivate') }}</h4>
            <p>{{ $t('Home.streamerModeDetails') }}</p>
        </v-alert>
    </div>
</template>
<script>
import About from '@/components/page/About';
import { languages, RTL_LANGUAGES } from '../../lang';
import { mapMutations, mapState } from 'vuex';
import * as MutationTypes from '@/store/mutation-types';

export default {
    components: {
        About,
    },
    data() {
        return {
            aboutDialog: false,
            languages,
            menuMobile: false,
            showAlertStreamerMode: false,
        };
    },
    computed: {
        ...mapState({
            streamerMode: (state) => state.homeStore.streamerMode,
        }),
        demoMode() {
            return !!process.env.VUE_APP_DEMO_MODE;
        },
    },
    methods: {
        ...mapMutations({
            setStreamerMode: MutationTypes.HOME_SET_STREAMER_MODE,
        }),
        changeStreamerMode(streamerMode){
            this.setStreamerMode(streamerMode);
            if(streamerMode){
                this.showAlertStreamerMode = true;
            } else if(this.showAlertStreamerMode){
                this.showAlertStreamerMode = false;
            }
        },
        switchLanguage(language) {

            this.$i18n.locale = language;
            this.$vuetify.lang.current = language;
            this.$vuetify.rtl = RTL_LANGUAGES.includes(language);
            this.saveLanguage(language);
        },
        saveLanguage(language) {
            localStorage.setItem('language', language);
        },
    },
};
</script>
<style lang="scss" scoped>
.header {
    z-index: 1;
    padding: 0 5%;
    background-color: #f1e9d6 !important;
    .header__nav,
    .header__nav__btns {
        display: flex;
        & > div {
            margin: 0 1.5rem;
        }
    }
    .v-btn {
        a {
            text-decoration: none;
            color: initial;
        }
        font-size: 1.2rem;
    }
    .header__logo {
        height: 6rem;
        width: auto;
    }
    .header__logo-min {
        display: none;
    }
    .header__nav-icon{
        visibility: hidden;
    }
}

#alertStreamerMode {
    width: fit-content;
    position: absolute;
    z-index: 2;
    right: 0;
    margin: 0.625rem;
}
@media (max-width: 780px) {
    .header {
        .header__logo {
            display: none;
        }
        .header__logo-min {
            display: block;
        }
        .header__nav{
            &:not(.visible){
                display: none;
            }
            position: absolute;
            top: 6.2rem;
            right: 0rem;
            background: #f1e9d6;
            padding: 1rem;
            box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%);
            border-bottom-left-radius: .3125rem;
            border-bottom-right-radius: .3125rem;
            max-width: 100%;
            flex-direction: row;
            .header__nav__btns{
                margin: 0;
            }
        }
        .header__nav-icon{
            visibility: visible;
        }
    }
}
</style>
