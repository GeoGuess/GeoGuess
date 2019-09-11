<template>
	<div>
    <v-app-bar
      class="header-game" 
      color="grey darken-4">
      <v-toolbar-title class="toolbar-title">Geoguess Master</v-toolbar-title>

      <div class="flex-grow-1"></div>
      <div class="round-score-container">
        <span class="sub-text">ROUND: </span>
      </div>
      <div>
        <span class="main-text">1 / 5</span>
      </div>
      <div class="round-score-container">
        <span class="sub-text">SCORE: </span>
      </div>
      <div>
        <span class="main-text">{{ distance }} km away</span>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    props: [
      'distance',
    ],
  }
</script>

<style scoped>
  .header-game {
    z-index: 2;
    opacity: 0.8;
  }

  .toolbar-title {
    color: white;
  }

  .round-score-container {
    padding: 0 10px 0 40px;
  }

  .main-text {
    color: white;
  }

  .sub-text {
    color: #616161;
  }
</style>
