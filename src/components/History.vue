<template>
  <v-card>
   <v-card-title>
      History
   </v-card-title>
    <v-data-table
    id="history-table"
    :headers="headers"
    :items="items"
    show-expand
    single-expand
    item-key="date"
  >    
    <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
            <GmapMap
                :center="{lat:0, lng:0}"
                :options="{
                    mapTypeControl: false,
                }"
                :zoom="0"
                map-type-id="terrain"
                :style="'width:'+($viewport.width-100)+'px ; height: 400px'"
                >
                <div v-if="!item.multiplayer">
                    <div 
                    :key="index"
                    v-for="(r, index) in item.rounds">
                        <GmapMarker
                            :position="r.guess"
                        />
                        <GmapInfoWindow
                            :options="infoOptions"
                            :position="r.guess">        
                            <p><b>{{r.distance / 1000 }} </b> km away! You won <b>{{ r.points }}</b> points!</p>
                        </GmapInfoWindow>
                        <GmapPolyline 
                            :path="[r.position, r.guess]"
                        />
                        <GmapMarker        
                            :icon="icon"
                            :position="r.position"
                        />
                        
                    </div>
                </div>
                <div v-else>
                    <div 
                    :key="indexR"
                    v-for="(r, indexR) in item.rounds">
                    
                        <div 
                        :key="indexR+''+indexP"                        
                        v-for="(player, indexP) in Object.keys(r.players)">
                        
                            <GmapMarker
                                :label="(player && player.length > 0) ? player[0].toUpperCase() : undefined"
                                :position="r.players[player].guess"
                            />
                            <GmapInfoWindow
                                :options="infoOptions"
                                :position="r.players[player].guess">       
                                <p><b>{{player}}</b> is <b>{{r.players[player].distance / 1000 }} </b> km away! You won <b>{{ r.players[player].points }}</b> points!</p>
                            </GmapInfoWindow>
                            <GmapPolyline 
                                :path="[r.position, r.players[player].guess]"
                                :options="{                                    
                                    strokeColor: strokeColors[indexP%strokeColors.length],
                                }"
                            />
                        </div>
                        <GmapMarker        
                            :icon="icon"
                            :position="r.position"
                        />
                        
                    </div>

                </div>                
            </GmapMap>
        </td>
    </template>
  </v-data-table>
  </v-card>
</template>
<script>
export default {
    name:"History",
    props:["history"],
    data(){
        return {                
            infoOptions: {
                pixelOffset: {
                    width: 0,
                    height: -42
                }
            },      
            strokeColors: [
                '#F44336',
                '#76FF03',
                '#FFEB3B',
                '#FF4081',
                '#18FFFF',
                '#18FFFF',
            ],
            icon: window.location.origin+'/img/icons/favicon-16x16.png',
            headers: [
                {
                    text: "Date",
                    value: 'dateString',
                },
                {
                    text: "Mode",
                    value: 'mode',
                },
                {
                    text: "Time",
                    value: 'time',
                },
                {
                    text: "Distance",
                    value: 'score',
                },
                {
                    text: "Points",
                    value: 'points',
                },
                {
                    text: '', 
                    value: 'data-table-expand' 
                },
            ]
        }
    },
    computed:{
        items(){
            return this.history.map((g) => ({
                ...g,
                score: g.score/1000,
                points: g.points,
                dateString: new Date(g.date).toLocaleString(),
                mode: g.multiplayer ? "With Friends": "Single Player",
                time: g.timeLimitation===0 ? "Infinite": g.timeLimitation/60
            }))
        }
    }
}
</script>

