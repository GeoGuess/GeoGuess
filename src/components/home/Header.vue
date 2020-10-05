<template>
    <div>
        <v-app-bar class="header" height="100">
            <img class="header__logo" src="@/assets/geoguessLogo.png" />

            <div class="flex-grow-1"></div>

            <v-btn text @click="historyDialog = true">{{
                $t('Home.historyBtn')
            }}</v-btn>
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                        <v-icon size="30">mdi-translate</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(language, index) in languages"
                        :key="index"
                        @click="switchLanguage(language.value)"
                    >
                        <v-list-item-title>{{
                            language.text
                        }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-dialog v-model="historyDialog">
                <History :history="history" />
            </v-dialog>
        </v-app-bar>
    </div>
</template>
<script>
import History from '@/components/History';
export default {
    components: {
        History,
    },
    data() {
        return {
            drawer: false,
            historyDialog: false,
            history: localStorage.getItem('history')
                ? JSON.parse(localStorage.getItem('history'))
                : [],
            languages: [
                {
                    text: 'English',
                    value: 'en',
                },
                {
                    text: 'Français',
                    value: 'fr',
                },
                {
                    text: 'Deutsch',
                    value: 'de',
                },
                {
                    text: 'čeština',
                    value: 'cs',
                },
                {
                    text: '日本語',
                    value: 'ja',
                },
                {
                    text: 'Español',
                    value: 'es',
                },
            ],
        };
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
    padding: 0 5%;
    background-color: #f1e9d6 !important;
    .v-btn {
        font-size: 1.5rem;
        margin: 0 1.5rem;
    }
    .header__logo {
        height: 6rem;
        width: auto;
    }
}

@media (max-width: 660px) {
    .header {
        .header__logo {
            display: none;
        }
    }
}
</style>
