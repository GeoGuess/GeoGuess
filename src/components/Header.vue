<template>
  <v-app-bar
    v-if="$viewport.width > 450" 
    color="transparent"
    flat>
    <div>
      <v-img src="../assets/logo.png" width="45" />
    </div>
    <span id="title">
      Geoguess Master
    </span>
    <div class="flex-grow-1"></div>
    <v-btn 
      text
      color="#FFFFFF"
      href="#section-about">
      <span>About</span>
    </v-btn>
    <v-btn
      text
      color="#FFFFFF"
      href="#section-limitation">
      <span>Limitation</span>
    </v-btn>
    <v-btn
      text
      color="#FFFFFF"
      href="#footer">
      <span>Contact</span>
    </v-btn>
  </v-app-bar>
  <v-app-bar
    v-else
    color="transparent"
    flat>
    <div class="flex-grow-1"></div>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="#FFFFFF"
          v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn></template>
        <v-list>
          <v-list-item href="#section-about">
            <v-list-item-content>
              <v-list-item-title>ABOUT</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#section-limitation">
            <v-list-item-content>
              <v-list-item-title>LIMITATION</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="#footer">
            <v-list-item-content>
              <v-list-item-title>CONTACT</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  span {
    font-family: montserrat;
  }

  #title {
    color: #FFFFFF;
    font-weight: 700;
  }
</style>