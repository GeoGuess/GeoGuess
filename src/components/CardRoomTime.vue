<template>
	<v-card color="#061422">
		<v-card-title>
			<span id="card-title">Set a time limitation.</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row>
          <v-col 
            cols="6"
            sm="4"
            md="4"
            lg="4"
            xl="4">
            <v-select
              dark 
              v-model="timeLimitation"
              :items="timeLimitationItems"></v-select>
          </v-col>					
				</v-row>
			</v-container>
		</v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn
        dark
        depressed
        color="#FF5252"
        @click="setTimeLimitation">NEXT</v-btn>
      <v-btn
        dark
        depressed
        color="#43B581"
        @click="cancel">CANCEL</v-btn>
    </v-card-actions>
	</v-card>
</template>

<script>
	export default {
		data() {
			return {
        timeLimitation: 0,
        timeLimitationItems: [
          {
            text: 'Infinite',
            value: 0,
          },
          {
            text: '1',
            value: 1,
          },
          {
            text: '2',
            value: 2,
          },
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '5',
            value: 5,
          }, 
          {
            text: '6',
            value: 6,
          },
          {
            text: '7',
            value: 7,
          },
          {
            text: '8',
            value: 8,
          },
          {
            text: '9',
            value: 9,
          },
          {
            text: '10',
            value: 10,
          },          
        ],
			}
		},
		methods: {
			setTimeLimitation() {
				// Pass time limitation to parent component
				this.$emit('setTimeLimitation', this.timeLimitation)
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