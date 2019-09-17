<template>
  <div>
    <v-dialog 
      v-model="dialogMessage"
      max-width="80%"
      persistent
      :fullscreen="$viewport.width < 450">
      <v-card color="#FFF9C4">
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <v-container>
            <span>{{ dialogText }}</span>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: [
      'dialogMessage',
      'dialogTitle',
      'dialogText',
    ]
  }
</script>

<style scoped>
  
</style>
