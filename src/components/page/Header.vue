<template>
    <div>
        <v-app-bar
            class="header"
            height="100"
        >
            <router-link to="/">
                <img
                    class="header__logo"
                    src="@/assets/geoguessLogo.png"
                >
                <img
                    class="header__logo-min"
                    src="/img/icons/android-icon-72x72.png"
                >
            </router-link>

            <div class="flex-grow-1" />

            <nav class="header__nav">
                <v-btn
                    id="historyBtn"
                    text
                >
                    <router-link to="/history">
                        {{ $t('Home.historyBtn') }}
                    </router-link>
                </v-btn>
                <div class="header__nav__btns">
                    <v-btn
                        id="aboutBtn"
                        text
                        @click="aboutDialog = true"
                    >
                        <v-icon size="30">
                            mdi-help-circle
                        </v-icon>
                    </v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                id="languageBtn"
                                text
                                v-on="on"
                            >
                                <v-icon size="30">
                                    mdi-translate
                                </v-icon>
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

        <v-alert
            v-if="demoMode"
            color="#7289DA"
            dark
            class="demo-alert"
        >
            <v-row align="center">
                <v-col class="grow">
                    {{ $t('Demo.message') }}
                </v-col>
                <v-col class="shrink">
                    <v-btn
                        target="_blank"
                        href="https://discord.gg/9GXm6RT"
                    >
                        <v-icon left>
                            mdi-discord
                        </v-icon>
                        {{ $t('Demo.btn') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-alert>
    </div>
</template>
<script>
import About from '@/components/page/About';
import { languages } from '../../lang';

export default {
    components: {
        About,
    },
    data() {
        return {
            aboutDialog: false,
            languages,
        };
    },
    computed: {
        demoMode() {
            return !!process.env.VUE_APP_DEMO_MODE;
        },
    },
    methods: {
        switchLanguage(language) {
            this.$i18n.locale = language;
            this.$vuetify.lang.current = language;
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
    nav.header__nav,
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
}

@media (max-width: 660px) {
    .header {
        .header__logo {
            display: none;
        }
        .header__logo-min {
            display: block;
        }
    }
}
</style>
