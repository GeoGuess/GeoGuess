<template>
  <div>
    <v-dialog 
      persistent
      :fullscreen="$viewport.width < 450"
      v-model="dialogRoom"
      max-width="600">
      <template v-slot:activator="{ on }">
        <button 
          class="button" 
          id="with-friends-button"
          v-on="on">With Friends</button>
      </template>
      <v-card>
        <v-card-title>
          <span>{{ cardTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col 
                cols="12"
                v-if="cardTitle == 'Type a room name'">
                <v-text-field 
                  autofocus
                  :error-messages="errorMessage"
                  v-model="roomName"></v-text-field>
              </v-col>
              <v-col 
                cols="4"
                v-if="cardTitle == 'Set a room size'">
                <v-select 
                  v-model="roomSize"
                  :items="roomSizeItems"></v-select>
              </v-col>
              <v-col 
                cols="4"
                v-if="cardTitle == 'Set a time limitation'">
                <v-select 
                  v-model="timeLimitation"
                  :items="timeLimitationItems"></v-select>
              </v-col>
              <v-col 
                cols="12"
                v-if="cardTitle == 'Type a player name'">
                <v-text-field v-model="playerName"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            class="white--text"
            depressed
            color="#F44336"
            @click="clickNext">NEXT</v-btn>
          <v-btn
            class="white--text"
            depressed
            color="#00E676"
            @click="cancel">CANCEL</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  export default {
    data() {
      return {
        dialogRoom: false,
        cardTitle: 'Type a room name',
        errorMessage: '',
        room: null,
        playerNumber: null,
        roomName: '',
        roomSize: 2,
        roomSizeItems: [
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
        ],
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
        playerName: '',
      }
    },
    methods: {
      clickNext() {
        if (this.cardTitle == 'Type a room name') {
          this.searchRoom()
        }
        else if (this.cardTitle == 'Set a room size') {
          this.setRoomSize()
        } else if (this.cardTitle == 'Set a time limitation') {
          this.setTimeLimitation()
        } else if (this.cardTitle == 'Type a player name') {
          this.setPlayerName()
        }
      },
      searchRoom() {
        if (this.roomName == '') {
          this.errorMessage = 'Invalid name. Please try another.'
        } else {
          const that = this
          this.room = firebase.database().ref(this.roomName)
          this.room.once('value', function(snapshot) {
            var numberOfPlayers = snapshot.child('player_name').numChildren()
            that.playerNumber = numberOfPlayers + 1

            if (numberOfPlayers == 0) {
              // Put the tentative player's name into the room node
              // So that other player can't enter as the first player while the player decide the name and room size
              that.room.child('player_name').update({
                Player1: 'player1'
              }, function(error) {
                if (error) {

                } else {
                  // Ask the first player to decide the room size
                  that.cardTitle = 'Set a room size'
                }
              })

            } else if (!snapshot.hasChild('size') || !snapshot.hasChild('street_views')) {
              // Prevent other players from getting into the room earlier than the first player
              that.errorMessage = 'The first player is creating the room right now. Please wait and try again.'

            } else if (numberOfPlayers >= snapshot.child('size').val()) {
              // In case the room is already full
              that.errorMessage = 'This room is already full. Please try another.'

            } else {
              // Put other player's tentative name
              room.child('player_name/Player' + that.playerNumber).set('player' + that.playerNumber, function(error) {
                if (error) {

                } else {
                  // Let the other players decide the player name
                  that.cardTitle = 'Type a player name'
                }
              })
            }

          })
        }
      },
      setRoomSize() {
        const that = this
        this.room.update({
          size: this.roomSize
        }, function(error) {
          if (error) {

          } else {
            // Ask the first player to set time limitation
            that.cardTitle = 'Set a time limitation'
          }
        })
      },
      setTimeLimitation() {
        const that = this
        this.room.update({
          time_limitation: this.timeLimitation
        }, function(error) {
          if (error) {

          } else {
            that.cardTitle = 'Type a player name'
          }
        })
      },
      setPlayerName() {
        this.room.child('player_name/Player' + this.playerNumber).set(this.playerName, function(error) {
          if (error) {

          } else {
            // Start the game

          }
        })
      },
      cancel() {
        // Remove the room
        this.dialogRoom = false
        if (this.room != null) {
          this.room.remove()
        }
      }
    }
  }
</script>

<style scoped>
  .button {
    border: none;
    border-radius: 40px;
    color: white;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    padding: 10px 100px;
    width: 400px;
  }

  #with-friends-button {
    background-color: #00E676;
  }

  @media (max-width: 450px) {
    .button {
      border: none;
      border-radius: 40px;
      color: white;
      font-size: 20px;
      text-decoration: none;
      text-align: center;
      padding: 2% 15%;
      margin: 5% 0;
      width: 80%;      
    }
  }
</style>
