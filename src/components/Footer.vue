<template>
    <v-footer id="footer" color="#061422" height="210">
        <v-container>
            <v-row justify="center">
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://github.com/GeoGuess/Geoguess"
                >
                    <v-icon size="30">mdi-github-circle</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://discord.gg/9GXm6RT"
                >
                    <v-icon size="30">mdi-discord</v-icon>
                </v-btn>
                <v-btn
                    class="ml-4 mr-4"
                    icon
                    color="#FFFFFF"
                    href="https://twitter.com/BilelJegham"
                >
                    <v-icon size="30">mdi-twitter</v-icon>
                </v-btn>
            </v-row>
            <v-row class="mt-8" justify="center">
                <span id="copyright-text"
                    >{{ $t('Footer.under') }}
                    <a
                        href="https://raw.githubusercontent.com/spider-hand/Geoguess-Master-Web/master/LICENSE"
                        >MIT license</a
                    ></span
                >
            </v-row>
            <v-row class="mt-3" justify="center">
                <v-btn
                    text
                    color="#FFFFFF"
                    @click="$router.push('privacy-policy')"
                >
                    <span id="privacy-policy">{{
                        $t('Footer.privacyPolicy')
                    }}</span>
                </v-btn>
            </v-row>

            <v-row class="mt-3" justify="center"> </v-row>
            <v-row v-if="$viewport.width < 450">
                <v-col cols="6">
                    <v-select
                        :items="languages"
                        :label="getCurrentLanguage"
                        solo
                        @change="switchLanguage"
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
export default {
    data() {
        return {
            languages: [
                {
                    text: 'English',
                    value: 'en',
                },
                {
                    text: '日本語',
                    value: 'ja',
                },
            ],
        };
    },
    computed: {
        getCurrentLanguage() {
            return this.languages.find(
                (language) => language.value == this.$i18n.locale
            ).text;
        },
    },
    methods: {
        switchLanguage(language) {
            this.$i18n.locale = language;
            this.saveLanguage(language);
        },
        saveLanguage(language) {
            localStorage.setItem('language', language);
        },
    },
};
</script>

<style>
#copyright-text,
#credit-text {
    color: #7d7d7d;
}
</style>
