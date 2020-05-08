<template>
  <v-dialog 
    v-model="dialogMessage"
    max-width="600"
    persistent
    :fullscreen="$viewport.width < 450">
    <v-card color="#061422">
      <v-card-title>
        <span id="card-title">{{ dialogTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>{{ dialogText }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="closeBtn">
        <v-spacer></v-spacer>
        <v-btn
          dark
          depressed
          color="#FF5252"          
          @click="$emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: [
      'dialogMessage',
      'dialogTitle',
      'dialogText',
      'closeBtn',
    ]
  }
</script>

<style scoped>
  span {
    font-family: Montsetrrat;    
    color: #888;
  }

  #card-title {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    opacity: 0.9;
  }  
</style>
