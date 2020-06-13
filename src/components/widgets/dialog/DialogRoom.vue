<template>
  <v-dialog 
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialogRoom"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        id="multi-player-button"
        class="ml-8 mr-8"
        dark
        color="#43B581"
        v-on="on">
        With Friends
      </v-btn>
    </template>
    <component 
      :is="currentComponent"
      :errorMessage="errorMessage"
      @searchRoom="searchRoom"
      @setRoomSize="setRoomSize"
      @setTimeLimitation="setTimeLimitation"
      @setPlayerName="setPlayerName"
      @cancel="cancel" />
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import CardRoomName from '@/components/widgets/card/CardRoomName'
  import CardRoomSize from '@/components/widgets/card/CardRoomSize'
  import CardRoomTime from '@/components/widgets/card/CardRoomTime'
  import CardRoomPlayerName from '@/components/widgets/card/CardRoomPlayerName'

  export default {
    data() {
      return {
        dialogRoom: false,
        errorMessage: '',
        room: null,
        roomName: '',
        currentComponent: 'roomName',
      }
    },
    components: {
      'roomName': CardRoomName,
      'roomSize': CardRoomSize,
      'timeLimitation': CardRoomTime,
      'playerName': CardRoomPlayerName,
    },
    methods: {
      searchRoom(roomName) {
        if (roomName == '') {
          this.errorMessage = 'Invalid name. Please try another.'
        } else {
          this.room = firebase.database().ref(roomName)

          // Save room name so it can be used in setPlayerName()
          this.roomName = roomName

          this.room.once('value', (snapshot) => {
            var numberOfPlayers = snapshot.child('playerName').numChildren()
            this.playerNumber = numberOfPlayers + 1

            if (numberOfPlayers == 0) {
              // Put the tentative player's name into the room node
              // So that other player can't enter as the first player while the player decide the name and room size
              this.room.child('playerName').update({
                player1: 'player1'
              }, (error) => {
                if (!error) {
                  // Put the timestamp the room is created so the expired rooms can be removed by cloud function
                  this.room.update({
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                  })
                  this.currentComponent = 'roomSize'
                }
              })

            } else if (!snapshot.hasChild('size') || !snapshot.hasChild('streetView')) {
              // Prevent other players from getting into the room earlier than the first player
              this.errorMessage = 'The first player is creating the room right now. Please wait and try again.'

            } else if (numberOfPlayers >= snapshot.child('size').val()) {
              this.errorMessage = 'This room is already full. Please try another.'

            } else {
              // Put other player's tentative name
              this.room.child('playerName/player' + this.playerNumber).set('player' + this.playerNumber, (error) => {
                if (!error) {
                  this.currentComponent = 'playerName'
                }
              })
            }

          })
        }
      },
      setRoomSize(roomSize) {
        this.room.update({
          size: roomSize
        }, (error) => {
          if (!error) {
            this.currentComponent = 'timeLimitation'
          }
        })
      },
      setTimeLimitation(timeLimitation) {
        this.room.update({
          timeLimitation: timeLimitation
        }, (error) => {
          if (!error) {
            this.currentComponent = 'playerName'
          }
        })
      },
      setPlayerName(playerName) {
        this.room.child('playerName/player' + this.playerNumber).set(playerName, (error) => {
          if (!error) {
            // Start the game
            this.$router.push({
              name: 'with-friends',
              params: { 
                roomName: this.roomName, 
                playerNumber: this.playerNumber, 
              }
            })
          }
        })
      },
      cancel() {
        // Reset
        this.currentComponent = 'roomName'
        this.roomName = ''
        this.errorMessage = ''

        // Remove the room
        this.dialogRoom = false
        if (this.room != null) {
          if (this.playerNumber == 1) {
            // Remove the entire node if the player is the first player
            this.room.remove()
          } else {
            // Remove only the player's name node if the player isn't the first player
            this.room.child('playerName/player' + this.playerNumber).remove()
          }
        }
      }
    }
  }
</script>

<style scoped>
  span {
    font-family: Montsetrrat;
  }

  #multi-player-button {
    height: 44px;
    width: 240px;
    border-radius: 40px;
  }
</style>
