<template>
	<div>
    <v-app-bar
      class="header-game" 
      color="grey darken-4">
      <div class="flex-grow-1"></div>
      <div class="round-score-container">
        <span class="sub-text">ROUND: </span>
      </div>
      <div>
        <span class="main-text">{{ round }} / 5</span>
      </div>
      <div class="round-score-container">
        <span class="sub-text">SCORE: </span>
      </div>
      <div>
        <span class="main-text">{{ score }} km away</span>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    props: [
      'distance',
      'score',
      'round',
    ],
  }
</script>

<style scoped>
  .header-game {
    z-index: 3;
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
