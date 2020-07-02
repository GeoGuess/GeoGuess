<template>
  <v-card color="#061422">
    <v-card-title>
      <span id="card-title">{{ $t('CardRoomName.title') }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
            <v-col
                    cols="6"
                    sm="4"
                    md="4"
                    lg="4"
                    xl="4"
                    v-if="cardTitle == 'Set a difficulty level'">
              <v-autocomplete
                      dark
                      v-model="difficulty"
                      :items="difficultyItems"
                      autofocus></v-autocomplete>
            </v-col></v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        dark
        depressed
        color="#FF5252"
        @click="searchRoom">{{ $t('CardRoomName.next') }}</v-btn>
      <v-btn
        dark
        depressed
        color="#43B581"
        @click="cancel">{{ $t('CardRoomName.cancel') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
  export default {
    props: [
      "errorMessage",
    ],
    data() {
      return {
        roomName: '',
      }
    },
    methods: {
      searchRoom() {
        // Pass room name to parent component
        this.$emit('searchRoom', this.roomName)
      },
      cancel() {
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped>
  #card-title {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    opacity: 0.9;
  } 
</style>