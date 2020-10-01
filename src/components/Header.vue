<template>
  <v-app-bar v-if="$viewport.width > 480" color="transparent" flat>
    <div>
      <v-img src="@/assets/logo.png" width="45" />
    </div>
    <span id="title"> Geoguess 2 </span>
    <div class="flex-grow-1"></div>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn text color="#FFFFFF" v-on="on">
          <span>{{ $t("Header.language") }}</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(language, index) in languages"
          :key="index"
          @click="switchLanguage(language.value)"
        >
          <v-list-item-title>{{ language.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn text color="#FFFFFF" href="#section-about">
      <span>{{ $t("Header.about") }}</span>
    </v-btn>
    <v-btn text color="#FFFFFF" href="#section-limitation">
      <span>{{ $t("Header.limitation") }}</span>
    </v-btn>
    <v-btn text color="#FFFFFF" href="#footer">
      <span>{{ $t("Header.contact") }}</span>
    </v-btn>
  </v-app-bar>
  <v-app-bar v-else color="transparent" flat>
    <div class="flex-grow-1"></div>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn icon color="#FFFFFF" v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn></template
      >
      <v-list>
        <v-list-item href="#section-about">
          <v-list-item-content>
            <v-list-item-title>{{ $t("Header.about") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="#section-limitation">
          <v-list-item-content>
            <v-list-item-title>{{ $t("Header.limitation") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="#footer">
          <v-list-item-content>
            <v-list-item-title>{{ $t("Header.contact") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      languages: [
        {
          text: "English",
          value: "en",
        },
        {
          text: "Français",
          value: "fr",
        },
        {
          text: "Deutsch",
          value: "de",
        },
        {
          text: "čeština",
          value: "cs",
        },
        {
          text: "日本語",
          value: "ja",
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
      localStorage.setItem("language", language);
    },
  },
};
</script>

<style scoped>
#title {
  color: #ffffff;
  font-weight: 700;
}
</style>